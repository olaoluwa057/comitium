import { ethers } from 'hardhat';
import { BigNumber, Signer } from 'ethers';
import * as helpers from '../utils/helpers';
import { expect } from 'chai';
import { ComitiumFacet, Erc20Mock, RewardsMock, MulticallMock, ChangeRewardsFacet } from '../typechain';
import * as time from '../utils/time';
import * as deploy from '../utils/deploy';
import { diamondAsFacet } from '../utils/diamond';
import { moveAtTimestamp } from '../utils/helpers';

describe('Comitium', function () {
    const amount = BigNumber.from(100).mul(BigNumber.from(10).pow(18));

    let comitium: ComitiumFacet, fdt: Erc20Mock, rewardsMock: RewardsMock, changeRewards: ChangeRewardsFacet;

    let user: Signer, userAddress: string;
    let happyPirate: Signer, happyPirateAddress: string;
    let flyingParrot: Signer, flyingParrotAddress: string;

    let snapshotId: any;

    before(async function () {
        await setupSigners();
        fdt = (await deploy.deployContract('ERC20Mock')) as Erc20Mock;

        const cutFacet = await deploy.deployContract('DiamondCutFacet');
        const loupeFacet = await deploy.deployContract('DiamondLoupeFacet');
        const ownershipFacet = await deploy.deployContract('OwnershipFacet');
        const ComitiumFacet = await deploy.deployContract('ComitiumFacet');
        const changeRewardsFacet = await deploy.deployContract('ChangeRewardsFacet');
        const diamond = await deploy.deployDiamond(
            'Comitium',
            [cutFacet, loupeFacet, ownershipFacet, ComitiumFacet, changeRewardsFacet],
            userAddress,
        );

        rewardsMock = (await deploy.deployContract('RewardsMock')) as RewardsMock;

        changeRewards = (await diamondAsFacet(diamond, 'ChangeRewardsFacet')) as ChangeRewardsFacet;
        comitium = (await diamondAsFacet(diamond, 'ComitiumFacet')) as ComitiumFacet;
        await comitium.initComitium(fdt.address, rewardsMock.address);
    });

    beforeEach(async function () {
        snapshotId = await ethers.provider.send('evm_snapshot', []);
    });

    afterEach(async function () {
        const ts = await helpers.getLatestBlockTimestamp();

        await ethers.provider.send('evm_revert', [snapshotId]);

        await helpers.moveAtTimestamp(ts + 5);
    });

    describe('General tests', function () {
        it('should be deployed', async function () {
            expect(comitium.address).to.not.equal(0);
        });
    });

    describe('deposit', function () {
        it('reverts if called with 0', async function () {
            await expect(comitium.connect(user).deposit(0)).to.be.revertedWith('Amount must be greater than 0');
        });

        it('reverts if user did not approve token', async function () {
            await expect(comitium.connect(user).deposit(amount)).to.be.revertedWith('Token allowance too small');
        });

        it('calls registerUserAction on rewards contract', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            expect(await rewardsMock.calledWithUser()).to.equal(userAddress);
        });

        it('stores the user balance in storage', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            expect(await comitium.balanceOf(userAddress)).to.equal(amount);
        });

        it('transfers the user balance to itself', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            expect(await fdt.transferFromCalled()).to.be.true;
            expect(await fdt.balanceOf(comitium.address)).to.be.equal(amount);
        });

        it('updates the total of fdt locked', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            expect(await comitium.fdtStaked()).to.be.equal(amount);
        });

        it('updates the delegated user\'s voting power if user delegated his balance', async function () {
            await prepareAccount(user, amount.mul(2));
            await comitium.connect(user).deposit(amount);
            await comitium.connect(user).delegate(happyPirateAddress);

            expect(await comitium.delegatedPower(happyPirateAddress)).to.be.equal(amount);

            await comitium.connect(user).deposit(amount);

            expect(await comitium.delegatedPower(happyPirateAddress)).to.be.equal(amount.mul(2));
        });

        it('works with multiple deposit in same block', async function () {
            const multicall = (await deploy.deployContract('MulticallMock', [comitium.address, fdt.address])) as MulticallMock;

            await fdt.mint(multicall.address, amount.mul(5));

            await multicall.multiDeposit(amount);

            expect(await comitium.balanceOf(multicall.address)).to.equal(amount.mul(3));
        });

        it('does not fail if rewards contract is set to address(0)', async function () {
            await changeRewards.changeRewardsAddress(helpers.zeroAddress);

            await prepareAccount(user, amount);
            await expect(comitium.connect(user).deposit(amount)).to.not.be.reverted;
            expect(await comitium.balanceOf(userAddress)).to.equal(amount);
        });
    });

    describe('depositAndLock', function () {
        it('calls deposit and then lock', async function () {
            await prepareAccount(user, amount.mul(2));

            const ts = await helpers.getLatestBlockTimestamp();
            await expect(comitium.connect(user).depositAndLock(amount, ts+3600)).to.not.be.reverted;
            expect(await comitium.balanceOf(userAddress)).to.equal(amount);
            expect(await comitium.userLockedUntil(userAddress)).to.equal(ts+3600);
        });
    });

    describe('balanceAtTs', function () {
        it('returns 0 if no checkpoint', async function () {
            const ts = await helpers.getLatestBlockTimestamp();
            expect(await comitium.balanceAtTs(userAddress, ts)).to.be.equal(0);
        });

        it('returns 0 if timestamp older than first checkpoint', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            expect(await comitium.balanceAtTs(userAddress, ts - 1)).to.be.equal(0);
        });

        it('return correct balance if timestamp newer than latest checkpoint', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            expect(await comitium.balanceAtTs(userAddress, ts + 1)).to.be.equal(amount);
        });

        it('returns correct balance if timestamp between checkpoints', async function () {
            await prepareAccount(user, amount.mul(3));
            await comitium.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            await helpers.moveAtTimestamp(ts + 30);
            await comitium.connect(user).deposit(amount);

            expect(await comitium.balanceAtTs(userAddress, ts + 15)).to.be.equal(amount);

            await helpers.moveAtTimestamp(ts + 60);
            await comitium.connect(user).deposit(amount);

            expect(await comitium.balanceAtTs(userAddress, ts + 45)).to.be.equal(amount.mul(2));
        });
    });

    describe('fdtStakedAtTs', function () {
        it('returns 0 if no checkpoint', async function () {
            const ts = await helpers.getLatestBlockTimestamp();
            expect(await comitium.fdtStakedAtTs(ts)).to.be.equal(0);
        });

        it('returns 0 if timestamp older than first checkpoint', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            expect(await comitium.fdtStakedAtTs(ts - 1)).to.be.equal(0);
        });

        it('returns correct balance if timestamp newer than latest checkpoint', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            expect(await comitium.fdtStakedAtTs(ts + 1)).to.be.equal(amount);
        });

        it('returns correct balance if timestamp between checkpoints', async function () {
            await prepareAccount(user, amount.mul(3));
            await comitium.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            await helpers.moveAtTimestamp(ts + 30);
            await comitium.connect(user).deposit(amount);

            expect(await comitium.fdtStakedAtTs(ts + 15)).to.be.equal(amount);

            await helpers.moveAtTimestamp(ts + 60);
            await comitium.connect(user).deposit(amount);

            expect(await comitium.fdtStakedAtTs(ts + 45)).to.be.equal(amount.mul(2));
        });
    });

    describe('withdraw', async function () {
        it('reverts if called with 0', async function () {
            await expect(comitium.connect(user).withdraw(0)).to.be.revertedWith('Amount must be greater than 0');
        });

        it('reverts if user does not have enough balance', async function () {
            await expect(comitium.connect(user).withdraw(amount)).to.be.revertedWith('Insufficient balance');
        });

        it('calls registerUserAction on rewards contract', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            expect(await rewardsMock.calledWithUser()).to.equal(userAddress);
        });

        it('sets user balance to 0', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            expect(await comitium.connect(user).withdraw(amount)).to.not.throw;
            expect(await comitium.balanceOf(userAddress)).to.be.equal(0);
        });

        it('does not affect old checkpoints', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            const currentTs = await helpers.getLatestBlockTimestamp();
            await helpers.moveAtTimestamp(currentTs + 15);

            await comitium.connect(user).withdraw(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            expect(await comitium.balanceAtTs(userAddress, ts - 1)).to.be.equal(amount);
        });

        it('transfers balance to the user', async function () {
            await prepareAccount(user, amount.mul(2));
            await comitium.connect(user).deposit(amount.mul(2));

            expect(await fdt.balanceOf(comitium.address)).to.be.equal(amount.mul(2));

            await comitium.connect(user).withdraw(amount);

            expect(await fdt.transferCalled()).to.be.true;
            expect(await fdt.balanceOf(userAddress)).to.be.equal(amount);
            expect(await fdt.balanceOf(comitium.address)).to.be.equal(amount);
        });

        it('updates the total of fdt locked', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);
            expect(await comitium.fdtStaked()).to.be.equal(amount);

            await comitium.connect(user).withdraw(amount);
            expect(await comitium.fdtStaked()).to.be.equal(0);
        });

        it('updates the delegated user\'s voting power if user delegated his balance', async function () {
            await prepareAccount(user, amount.mul(2));
            await comitium.connect(user).deposit(amount);
            await comitium.connect(user).delegate(happyPirateAddress);

            expect(await comitium.delegatedPower(happyPirateAddress)).to.be.equal(amount);

            await comitium.connect(user).withdraw(amount);

            expect(await comitium.delegatedPower(happyPirateAddress)).to.be.equal(0);
        });
    });

    describe('lock', async function () {
        it('reverts if timestamp is more than MAX_LOCK', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            const MAX_LOCK = (await comitium.MAX_LOCK()).toNumber();

            await expect(
                comitium.connect(user).lock(time.futureTimestamp(5 * MAX_LOCK))
            ).to.be.revertedWith('Timestamp too big');

            await expect(
                comitium.connect(user).lock(time.futureTimestamp(180 * time.day))
            ).to.not.be.reverted;
        });

        it('reverts if user does not have balance', async function () {
            await expect(
                comitium.connect(user).lock(time.futureTimestamp(10 * time.day))
            ).to.be.revertedWith('Sender has no balance');
        });

        it('reverts if user already has a lock and timestamp is lower', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);
            await comitium.connect(user).lock(time.futureTimestamp(1 * time.year));

            await expect(
                comitium.connect(user).lock(time.futureTimestamp(5 * time.day))
            ).to.be.revertedWith('New timestamp lower than current lock timestamp');
        });

        it('sets lock correctly', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            const expiryTs = time.futureTimestamp(1 * time.year);
            await comitium.connect(user).lock(expiryTs);

            expect(await comitium.userLockedUntil(userAddress)).to.be.equal(expiryTs);
        });

        it('allows user to increase lock', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            await comitium.connect(user).lock(time.futureTimestamp(30 * time.day));

            const expiryTs = time.futureTimestamp(1 * time.year);
            await expect(comitium.connect(user).lock(expiryTs)).to.not.be.reverted;
            expect(await comitium.userLockedUntil(userAddress)).to.be.equal(expiryTs);
        });

        it('does not block deposits for user', async function () {
            await prepareAccount(user, amount.mul(2));
            await comitium.connect(user).deposit(amount);

            await comitium.connect(user).lock(time.futureTimestamp(30 * time.day));

            await expect(comitium.connect(user).deposit(amount)).to.not.be.reverted;
            expect(await comitium.balanceOf(userAddress)).to.be.equal(amount.mul(2));
        });

        it('blocks withdrawals for user during lock', async function () {
            await prepareAccount(user, amount.mul(2));
            await comitium.connect(user).deposit(amount);

            const expiryTs = time.futureTimestamp(30 * time.day);
            await comitium.connect(user).lock(expiryTs);

            await expect(comitium.connect(user).withdraw(amount)).to.be.revertedWith('User balance is locked');
            expect(await comitium.balanceOf(userAddress)).to.be.equal(amount);

            await helpers.setNextBlockTimestamp(expiryTs + 3600);

            await expect(comitium.connect(user).withdraw(amount)).to.not.be.reverted;
            expect(await comitium.balanceOf(userAddress)).to.be.equal(0);
        });
    });

    describe('multiplierAtTs', async function () {
        it('returns expected multiplier', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            let ts: number = await helpers.getLatestBlockTimestamp();
            await helpers.setNextBlockTimestamp(ts + 5);

            const lockExpiryTs = ts + 5 + time.year;
            await comitium.connect(user).lock(lockExpiryTs);

            ts = await helpers.getLatestBlockTimestamp();

            const expectedMultiplier = multiplierAtTs(lockExpiryTs, ts);
            const actualMultiplier = await comitium.multiplierAtTs(userAddress, ts);

            expect(
                actualMultiplier
            ).to.be.equal(expectedMultiplier);
        });
    });

    describe('votingPower', async function () {
        it('returns raw balance if user did not lock', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            expect(await comitium.votingPower(userAddress)).to.be.equal(amount);
        });

        it('returns adjusted balance if user locked fdt', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            const expiryTs = time.futureTimestamp(time.year);
            await comitium.connect(user).lock(expiryTs);

            const blockTs = await helpers.getLatestBlockTimestamp();

            expect(
                await comitium.votingPower(userAddress)
            ).to.be.equal(
                amount.mul(multiplierAtTs(expiryTs, blockTs)).div(helpers.tenPow18)
            );
        });
    });

    describe('votingPowerAtTs', async function () {
        it('returns correct balance with no lock', async function () {
            await prepareAccount(user, amount.mul(2));
            await comitium.connect(user).deposit(amount);

            const firstDepositTs = await helpers.getLatestBlockTimestamp();

            await helpers.setNextBlockTimestamp(firstDepositTs + 30 * time.day);
            await comitium.connect(user).deposit(amount);

            const secondDepositTs = await helpers.getLatestBlockTimestamp();

            expect(await comitium.votingPowerAtTs(userAddress, firstDepositTs - 10)).to.be.equal(0);
            expect(await comitium.votingPowerAtTs(userAddress, firstDepositTs + 10)).to.be.equal(amount);
            expect(await comitium.votingPowerAtTs(userAddress, secondDepositTs - 10)).to.be.equal(amount);
            expect(await comitium.votingPowerAtTs(userAddress, secondDepositTs + 10)).to.be.equal(amount.mul(2));
        });

        it('returns correct balance with lock', async function () {
            await prepareAccount(user, amount.mul(2));

            await comitium.connect(user).deposit(amount);
            const firstDepositTs = await helpers.getLatestBlockTimestamp();

            await helpers.setNextBlockTimestamp(firstDepositTs + 3600);

            const expiryTs = time.futureTimestamp(1 * time.year);
            await comitium.connect(user).lock(expiryTs);
            const lockTs = await helpers.getLatestBlockTimestamp();
            const expectedMultiplier = multiplierAtTs(expiryTs, lockTs + 10);
            const expectedBalance1 = amount.mul(expectedMultiplier).div(helpers.tenPow18);

            await helpers.setNextBlockTimestamp(lockTs + 3600);

            await comitium.connect(user).deposit(amount);
            const secondDepositTs = await helpers.getLatestBlockTimestamp();
            const expectedMultiplier2 = multiplierAtTs(expiryTs, secondDepositTs + 10);
            const expectedBalance2 = amount.mul(2).mul(expectedMultiplier2).div(helpers.tenPow18);

            expect(await comitium.votingPowerAtTs(userAddress, firstDepositTs - 10)).to.be.equal(0);
            expect(await comitium.votingPowerAtTs(userAddress, firstDepositTs + 10)).to.be.equal(amount);
            expect(await comitium.votingPowerAtTs(userAddress, lockTs + 10)).to.be.equal(expectedBalance1);
            expect(await comitium.votingPowerAtTs(userAddress, secondDepositTs + 10)).to.be.equal(expectedBalance2);
        });

        it('returns voting power with decaying bonus', async function () {
            await prepareAccount(user, amount.mul(2));
            await comitium.connect(user).deposit(amount);
            const ts = await helpers.getLatestBlockTimestamp();
            const startTs = ts + 10;

            await helpers.setNextBlockTimestamp(startTs);
            const expiryTs = startTs + time.year;
            await comitium.connect(user).lock(expiryTs);

            let bonus = helpers.tenPow18;
            const dec = helpers.tenPow18.div(10);

            for (let i = 0; i <= 365; i += 36.5) {
                const ts = startTs + i * time.day;
                const multiplier = helpers.tenPow18.add(bonus);
                const expectedVP = amount.mul(multiplier).div(helpers.tenPow18);

                expect(await comitium.votingPowerAtTs(userAddress, ts)).to.be.equal(expectedVP);

                bonus = bonus.sub(dec);
            }
        });
    });

    describe('delegate', async function () {
        it('reverts if user delegates to self', async function () {
            await expect(comitium.connect(user).delegate(userAddress)).to.be.revertedWith("Can't delegate to self");
        });

        it('reverts if user does not have balance', async function () {
            await prepareAccount(user, amount);

            await expect(comitium.connect(user).delegate(happyPirateAddress))
                .to.be.revertedWith('No balance to delegate');

            await comitium.connect(user).deposit(amount);

            await expect(comitium.connect(user).delegate(happyPirateAddress)).to.not.be.reverted;
        });

        it('sets the correct voting powers for delegate and delegatee', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            await comitium.connect(user).delegate(happyPirateAddress);

            expect(await comitium.votingPower(happyPirateAddress)).to.be.equal(amount);
            expect(await comitium.votingPower(userAddress)).to.be.equal(0);
        });

        it('sets the correct voting power if delegatee has own balance', async function () {
            await prepareAccount(user, amount);
            await prepareAccount(happyPirate, amount);
            await comitium.connect(user).deposit(amount);
            await comitium.connect(happyPirate).deposit(amount);

            await comitium.connect(user).delegate(happyPirateAddress);

            expect(await comitium.votingPower(happyPirateAddress)).to.be.equal(amount.mul(2));
            expect(await comitium.votingPower(userAddress)).to.be.equal(0);
        });

        it('sets the correct voting power if delegatee receives from multiple users', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);
            await comitium.connect(user).delegate(flyingParrotAddress);

            await prepareAccount(happyPirate, amount);
            await comitium.connect(happyPirate).deposit(amount);
            await comitium.connect(happyPirate).delegate(flyingParrotAddress);

            expect(await comitium.votingPower(flyingParrotAddress)).to.be.equal(amount.mul(2));

            await prepareAccount(flyingParrot, amount);
            await comitium.connect(flyingParrot).deposit(amount);

            expect(await comitium.votingPower(flyingParrotAddress)).to.be.equal(amount.mul(3));
        });

        it('records history of delegated power', async function () {
            await prepareAccount(user, amount.mul(2));
            await comitium.connect(user).deposit(amount);

            await prepareAccount(happyPirate, amount);
            await comitium.connect(happyPirate).deposit(amount);

            await comitium.connect(user).delegate(flyingParrotAddress);
            const delegate1Ts = await helpers.getLatestBlockTimestamp();

            await moveAtTimestamp(delegate1Ts + 100);
            await comitium.connect(happyPirate).delegate(flyingParrotAddress);
            const delegate2Ts = await helpers.getLatestBlockTimestamp();

            await moveAtTimestamp(delegate2Ts + 100);
            await comitium.connect(user).deposit(amount);
            const delegate3Ts = await helpers.getLatestBlockTimestamp();

            await moveAtTimestamp(delegate3Ts+100);
            await prepareAccount(flyingParrot, amount);
            await comitium.connect(flyingParrot).deposit(amount);
            const depositTs = await helpers.getLatestBlockTimestamp();

            expect(await comitium.votingPowerAtTs(flyingParrotAddress, depositTs -1)).to.be.equal(amount.mul(3));
            expect(await comitium.votingPowerAtTs(flyingParrotAddress, delegate3Ts - 1)).to.be.equal(amount.mul(2));
            expect(await comitium.votingPowerAtTs(flyingParrotAddress, delegate2Ts - 1)).to.be.equal(amount);
            expect(await comitium.votingPowerAtTs(flyingParrotAddress, delegate1Ts - 1)).to.be.equal(0);
        });

        it('does not modify user balance', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);
            await comitium.connect(user).delegate(happyPirateAddress);

            expect(await comitium.balanceOf(userAddress)).to.be.equal(amount);
        });

        it('works with multiple calls in the same block', async function () {
            const multicall = (await deploy.deployContract('MulticallMock', [comitium.address, fdt.address])) as MulticallMock;

            await fdt.mint(multicall.address, amount);

            await multicall.multiDelegate(amount, userAddress, happyPirateAddress);

            expect(await comitium.delegatedPower(userAddress)).to.equal(amount);
            expect(await comitium.delegatedPower(happyPirateAddress)).to.equal(0);
        });
    });

    describe('stopDelegate', async function () {
        it('removes delegated voting power from delegatee and returns it to user', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);
            await comitium.connect(user).delegate(happyPirateAddress);

            expect(await comitium.votingPower(userAddress)).to.be.equal(0);
            expect(await comitium.votingPower(happyPirateAddress)).to.be.equal(amount);

            await comitium.connect(user).stopDelegate();

            expect(await comitium.votingPower(userAddress)).to.be.equal(amount);
            expect(await comitium.votingPower(happyPirateAddress)).to.be.equal(0);
        });

        it('preserves delegate history', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);
            await comitium.connect(user).delegate(happyPirateAddress);
            const delegateTs = await helpers.getLatestBlockTimestamp();

            await comitium.connect(user).stopDelegate();
            const stopTs = await helpers.getLatestBlockTimestamp();

            expect(await comitium.votingPowerAtTs(happyPirateAddress, delegateTs - 1)).to.be.equal(0);
            expect(await comitium.votingPowerAtTs(happyPirateAddress, stopTs - 1)).to.be.equal(amount);
            expect(await comitium.votingPowerAtTs(happyPirateAddress, stopTs + 1)).to.be.equal(0);
        });

        it('does not change any other delegated balances for the delegatee', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);
            await comitium.connect(user).delegate(flyingParrotAddress);

            await prepareAccount(happyPirate, amount);
            await comitium.connect(happyPirate).deposit(amount);
            await comitium.connect(happyPirate).delegate(flyingParrotAddress);

            expect(await comitium.votingPower(flyingParrotAddress)).to.be.equal(amount.mul(2));

            await comitium.connect(user).stopDelegate();

            expect(await comitium.votingPower(flyingParrotAddress)).to.be.equal(amount);
        });
    });

    describe('events', async function () {
        it('emits Deposit on call to deposit()', async function () {
            await prepareAccount(happyPirate, amount);

            await expect(comitium.connect(happyPirate).deposit(amount))
                .to.emit(comitium, 'Deposit').and.not.emit(comitium, 'DelegatedPowerIncreased');
        });

        it('emits Deposit & DelegatedPowerIncreased on call to deposit() with delegated power', async function () {
            await prepareAccount(happyPirate, amount.mul(2));
            await comitium.connect(happyPirate).deposit(amount);

            await comitium.connect(happyPirate).delegate(flyingParrotAddress);

            await expect(comitium.connect(happyPirate).deposit(amount))
                .to.emit(comitium, 'Deposit')
                .and.to.emit(comitium, 'DelegatedPowerIncreased');
        });

        it('emits Withdraw on call to withdraw()', async function () {
            await prepareAccount(happyPirate, amount.mul(2));
            await comitium.connect(happyPirate).deposit(amount);

            await expect(comitium.connect(happyPirate).withdraw(amount))
                .to.emit(comitium, 'Withdraw')
                .and.not.to.emit(comitium, 'DelegatedPowerDecreased');
        });

        it('emits Withdraw & DelegatedPowerDecreased on call to withdraw() with delegated power', async function () {
            await prepareAccount(happyPirate, amount.mul(2));
            await comitium.connect(happyPirate).deposit(amount.mul(2));
            await comitium.connect(happyPirate).delegate(flyingParrotAddress);

            await expect(comitium.connect(happyPirate).withdraw(amount))
                .to.emit(comitium, 'Withdraw')
                .and.to.emit(comitium, 'DelegatedPowerDecreased');
        });

        it('emits correct events on delegate', async function () {
            await prepareAccount(happyPirate, amount.mul(2));
            await comitium.connect(happyPirate).deposit(amount.mul(2));

            // when a user delegates without currently delegating, we should see the following events
            await expect(comitium.connect(happyPirate).delegate(flyingParrotAddress))
                .to.emit(comitium, 'Delegate')
                .and.to.emit(comitium, 'DelegatedPowerIncreased')
                .and.not.to.emit(comitium, 'DelegatedPowerDecreased');

            // when a user changes the user they delegate to, we should see the following events
            await expect(comitium.connect(happyPirate).delegate(userAddress))
                .to.emit(comitium, 'Delegate')
                .and.to.emit(comitium, 'DelegatedPowerIncreased')
                .and.to.emit(comitium, 'DelegatedPowerDecreased');

            // on stopDelegate, it should emit a Delegate(user, address(0)) event
            await expect(comitium.connect(happyPirate).stopDelegate())
                .to.emit(comitium, 'Delegate')
                .and.to.emit(comitium, 'DelegatedPowerDecreased')
                .and.not.to.emit(comitium, 'DelegatedPowerIncreased');
        });

        it('emits Lock event on call to lock()', async function () {
            await prepareAccount(happyPirate, amount.mul(2));
            await comitium.connect(happyPirate).deposit(amount.mul(2));

            const ts = await helpers.getLatestBlockTimestamp();
            await expect(comitium.connect(happyPirate).lock(ts + 3600))
                .to.emit(comitium, 'Lock');
        });
    });

    describe('multiplierOf', function () {
        it('returns the current multiplier of the user', async function () {
            await prepareAccount(user, amount);
            await comitium.connect(user).deposit(amount);

            let ts: number = await helpers.getLatestBlockTimestamp();
            await helpers.setNextBlockTimestamp(ts + 5);

            const lockExpiryTs = ts + 5 + time.year;
            await comitium.connect(user).lock(lockExpiryTs);

            ts = await helpers.getLatestBlockTimestamp();

            const expectedMultiplier = multiplierAtTs(lockExpiryTs, ts);
            const actualMultiplier = await comitium.multiplierOf(userAddress);

            expect(
                actualMultiplier
            ).to.be.equal(expectedMultiplier);
        });
    });

    async function setupSigners () {
        const accounts = await ethers.getSigners();
        user = accounts[0];
        happyPirate = accounts[3];
        flyingParrot = accounts[4];

        userAddress = await user.getAddress();
        happyPirateAddress = await happyPirate.getAddress();
        flyingParrotAddress = await flyingParrot.getAddress();
    }

    async function prepareAccount (account: Signer, balance: BigNumber) {
        await fdt.mint(await account.getAddress(), balance);
        await fdt.connect(account).approve(comitium.address, balance);
    }

    function multiplierAtTs (expiryTs: number, ts: number): BigNumber {
        return BigNumber.from(expiryTs - ts)
            .mul(helpers.tenPow18)
            .div(time.year)
            .add(helpers.tenPow18);
    }
});
