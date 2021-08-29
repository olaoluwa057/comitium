import { ethers } from 'hardhat';
import { BigNumber, Signer } from 'ethers';
import * as helpers from './helpers/helpers';
import { expect } from 'chai';
import { KernelFacet, Erc20Mock, RewardsMock, MulticallMock, ChangeRewardsFacet } from '../typechain';
import * as time from './helpers/time';
import * as deploy from './helpers/deploy';
import { diamondAsFacet } from './helpers/diamond';
import { moveAtTimestamp } from './helpers/helpers';

describe('Kernel', function () {
    const amount = BigNumber.from(100).mul(BigNumber.from(10).pow(18));

    let kernel: KernelFacet, entr: Erc20Mock, rewardsMock: RewardsMock, changeRewards: ChangeRewardsFacet;

    let user: Signer, userAddress: string;
    let happyPirate: Signer, happyPirateAddress: string;
    let flyingParrot: Signer, flyingParrotAddress: string;

    let snapshotId: any;

    before(async function () {
        await setupSigners();
        entr = (await deploy.deployContract('ERC20Mock')) as Erc20Mock;

        const cutFacet = await deploy.deployContract('DiamondCutFacet');
        const loupeFacet = await deploy.deployContract('DiamondLoupeFacet');
        const ownershipFacet = await deploy.deployContract('OwnershipFacet');
        const KernelFacet = await deploy.deployContract('KernelFacet');
        const changeRewardsFacet = await deploy.deployContract('ChangeRewardsFacet');
        const diamond = await deploy.deployDiamond(
            'Kernel',
            [cutFacet, loupeFacet, ownershipFacet, KernelFacet, changeRewardsFacet],
            userAddress,
        );

        rewardsMock = (await deploy.deployContract('RewardsMock')) as RewardsMock;

        changeRewards = (await diamondAsFacet(diamond, 'ChangeRewardsFacet')) as ChangeRewardsFacet;
        kernel = (await diamondAsFacet(diamond, 'KernelFacet')) as KernelFacet;
        await kernel.initKernel(entr.address, rewardsMock.address);
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
            expect(kernel.address).to.not.equal(0);
        });
    });

    describe('deposit', function () {
        it('reverts if called with 0', async function () {
            await expect(kernel.connect(user).deposit(0)).to.be.revertedWith('Amount must be greater than 0');
        });

        it('reverts if user did not approve token', async function () {
            await expect(kernel.connect(user).deposit(amount)).to.be.revertedWith('Token allowance too small');
        });

        it('calls registerUserAction on rewards contract', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            expect(await rewardsMock.calledWithUser()).to.equal(userAddress);
        });

        it('stores the user balance in storage', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            expect(await kernel.balanceOf(userAddress)).to.equal(amount);
        });

        it('transfers the user balance to itself', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            expect(await entr.transferFromCalled()).to.be.true;
            expect(await entr.balanceOf(kernel.address)).to.be.equal(amount);
        });

        it('updates the total of entr locked', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            expect(await kernel.entrStaked()).to.be.equal(amount);
        });

        it('updates the delegated user\'s voting power if user delegated his balance', async function () {
            await prepareAccount(user, amount.mul(2));
            await kernel.connect(user).deposit(amount);
            await kernel.connect(user).delegate(happyPirateAddress);

            expect(await kernel.delegatedPower(happyPirateAddress)).to.be.equal(amount);

            await kernel.connect(user).deposit(amount);

            expect(await kernel.delegatedPower(happyPirateAddress)).to.be.equal(amount.mul(2));
        });

        it('works with multiple deposit in same block', async function () {
            const multicall = (await deploy.deployContract('MulticallMock', [kernel.address, entr.address])) as MulticallMock;

            await entr.mint(multicall.address, amount.mul(5));

            await multicall.multiDeposit(amount);

            expect(await kernel.balanceOf(multicall.address)).to.equal(amount.mul(3));
        });

        it('does not fail if rewards contract is set to address(0)', async function () {
            await changeRewards.changeRewardsAddress(helpers.zeroAddress);

            await prepareAccount(user, amount);
            await expect(kernel.connect(user).deposit(amount)).to.not.be.reverted;
            expect(await kernel.balanceOf(userAddress)).to.equal(amount);
        });
    });

    describe('depositAndLock', function () {
        it('calls deposit and then lock', async function () {
            await prepareAccount(user, amount.mul(2));

            const ts = await helpers.getLatestBlockTimestamp();
            await expect(kernel.connect(user).depositAndLock(amount, ts+3600)).to.not.be.reverted;
            expect(await kernel.balanceOf(userAddress)).to.equal(amount);
            expect(await kernel.userLockedUntil(userAddress)).to.equal(ts+3600);
        });
    });

    describe('balanceAtTs', function () {
        it('returns 0 if no checkpoint', async function () {
            const ts = await helpers.getLatestBlockTimestamp();
            expect(await kernel.balanceAtTs(userAddress, ts)).to.be.equal(0);
        });

        it('returns 0 if timestamp older than first checkpoint', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            expect(await kernel.balanceAtTs(userAddress, ts - 1)).to.be.equal(0);
        });

        it('return correct balance if timestamp newer than latest checkpoint', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            expect(await kernel.balanceAtTs(userAddress, ts + 1)).to.be.equal(amount);
        });

        it('returns correct balance if timestamp between checkpoints', async function () {
            await prepareAccount(user, amount.mul(3));
            await kernel.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            await helpers.moveAtTimestamp(ts + 30);
            await kernel.connect(user).deposit(amount);

            expect(await kernel.balanceAtTs(userAddress, ts + 15)).to.be.equal(amount);

            await helpers.moveAtTimestamp(ts + 60);
            await kernel.connect(user).deposit(amount);

            expect(await kernel.balanceAtTs(userAddress, ts + 45)).to.be.equal(amount.mul(2));
        });
    });

    describe('entrStakedAtTs', function () {
        it('returns 0 if no checkpoint', async function () {
            const ts = await helpers.getLatestBlockTimestamp();
            expect(await kernel.entrStakedAtTs(ts)).to.be.equal(0);
        });

        it('returns 0 if timestamp older than first checkpoint', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            expect(await kernel.entrStakedAtTs(ts - 1)).to.be.equal(0);
        });

        it('returns correct balance if timestamp newer than latest checkpoint', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            expect(await kernel.entrStakedAtTs(ts + 1)).to.be.equal(amount);
        });

        it('returns correct balance if timestamp between checkpoints', async function () {
            await prepareAccount(user, amount.mul(3));
            await kernel.connect(user).deposit(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            await helpers.moveAtTimestamp(ts + 30);
            await kernel.connect(user).deposit(amount);

            expect(await kernel.entrStakedAtTs(ts + 15)).to.be.equal(amount);

            await helpers.moveAtTimestamp(ts + 60);
            await kernel.connect(user).deposit(amount);

            expect(await kernel.entrStakedAtTs(ts + 45)).to.be.equal(amount.mul(2));
        });
    });

    describe('withdraw', async function () {
        it('reverts if called with 0', async function () {
            await expect(kernel.connect(user).withdraw(0)).to.be.revertedWith('Amount must be greater than 0');
        });

        it('reverts if user does not have enough balance', async function () {
            await expect(kernel.connect(user).withdraw(amount)).to.be.revertedWith('Insufficient balance');
        });

        it('calls registerUserAction on rewards contract', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            expect(await rewardsMock.calledWithUser()).to.equal(userAddress);
        });

        it('sets user balance to 0', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            expect(await kernel.connect(user).withdraw(amount)).to.not.throw;
            expect(await kernel.balanceOf(userAddress)).to.be.equal(0);
        });

        it('does not affect old checkpoints', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            const currentTs = await helpers.getLatestBlockTimestamp();
            await helpers.moveAtTimestamp(currentTs + 15);

            await kernel.connect(user).withdraw(amount);

            const ts = await helpers.getLatestBlockTimestamp();

            expect(await kernel.balanceAtTs(userAddress, ts - 1)).to.be.equal(amount);
        });

        it('transfers balance to the user', async function () {
            await prepareAccount(user, amount.mul(2));
            await kernel.connect(user).deposit(amount.mul(2));

            expect(await entr.balanceOf(kernel.address)).to.be.equal(amount.mul(2));

            await kernel.connect(user).withdraw(amount);

            expect(await entr.transferCalled()).to.be.true;
            expect(await entr.balanceOf(userAddress)).to.be.equal(amount);
            expect(await entr.balanceOf(kernel.address)).to.be.equal(amount);
        });

        it('updates the total of entr locked', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);
            expect(await kernel.entrStaked()).to.be.equal(amount);

            await kernel.connect(user).withdraw(amount);
            expect(await kernel.entrStaked()).to.be.equal(0);
        });

        it('updates the delegated user\'s voting power if user delegated his balance', async function () {
            await prepareAccount(user, amount.mul(2));
            await kernel.connect(user).deposit(amount);
            await kernel.connect(user).delegate(happyPirateAddress);

            expect(await kernel.delegatedPower(happyPirateAddress)).to.be.equal(amount);

            await kernel.connect(user).withdraw(amount);

            expect(await kernel.delegatedPower(happyPirateAddress)).to.be.equal(0);
        });
    });

    describe('lock', async function () {
        it('reverts if timestamp is more than MAX_LOCK', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            const MAX_LOCK = (await kernel.MAX_LOCK()).toNumber();

            await expect(
                kernel.connect(user).lock(time.futureTimestamp(5 * MAX_LOCK))
            ).to.be.revertedWith('Timestamp too big');

            await expect(
                kernel.connect(user).lock(time.futureTimestamp(180 * time.day))
            ).to.not.be.reverted;
        });

        it('reverts if user does not have balance', async function () {
            await expect(
                kernel.connect(user).lock(time.futureTimestamp(10 * time.day))
            ).to.be.revertedWith('Sender has no balance');
        });

        it('reverts if user already has a lock and timestamp is lower', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);
            await kernel.connect(user).lock(time.futureTimestamp(1 * time.year));

            await expect(
                kernel.connect(user).lock(time.futureTimestamp(5 * time.day))
            ).to.be.revertedWith('New timestamp lower than current lock timestamp');
        });

        it('sets lock correctly', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            const expiryTs = time.futureTimestamp(1 * time.year);
            await kernel.connect(user).lock(expiryTs);

            expect(await kernel.userLockedUntil(userAddress)).to.be.equal(expiryTs);
        });

        it('allows user to increase lock', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            await kernel.connect(user).lock(time.futureTimestamp(30 * time.day));

            const expiryTs = time.futureTimestamp(1 * time.year);
            await expect(kernel.connect(user).lock(expiryTs)).to.not.be.reverted;
            expect(await kernel.userLockedUntil(userAddress)).to.be.equal(expiryTs);
        });

        it('does not block deposits for user', async function () {
            await prepareAccount(user, amount.mul(2));
            await kernel.connect(user).deposit(amount);

            await kernel.connect(user).lock(time.futureTimestamp(30 * time.day));

            await expect(kernel.connect(user).deposit(amount)).to.not.be.reverted;
            expect(await kernel.balanceOf(userAddress)).to.be.equal(amount.mul(2));
        });

        it('blocks withdrawals for user during lock', async function () {
            await prepareAccount(user, amount.mul(2));
            await kernel.connect(user).deposit(amount);

            const expiryTs = time.futureTimestamp(30 * time.day);
            await kernel.connect(user).lock(expiryTs);

            await expect(kernel.connect(user).withdraw(amount)).to.be.revertedWith('User balance is locked');
            expect(await kernel.balanceOf(userAddress)).to.be.equal(amount);

            await helpers.setNextBlockTimestamp(expiryTs + 3600);

            await expect(kernel.connect(user).withdraw(amount)).to.not.be.reverted;
            expect(await kernel.balanceOf(userAddress)).to.be.equal(0);
        });
    });

    describe('multiplierAtTs', async function () {
        it('returns expected multiplier', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            let ts: number = await helpers.getLatestBlockTimestamp();
            await helpers.setNextBlockTimestamp(ts + 5);

            const lockExpiryTs = ts + 5 + time.year;
            await kernel.connect(user).lock(lockExpiryTs);

            ts = await helpers.getLatestBlockTimestamp();

            const expectedMultiplier = multiplierAtTs(lockExpiryTs, ts);
            const actualMultiplier = await kernel.multiplierAtTs(userAddress, ts);

            expect(
                actualMultiplier
            ).to.be.equal(expectedMultiplier);
        });
    });

    describe('votingPower', async function () {
        it('returns raw balance if user did not lock', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            expect(await kernel.votingPower(userAddress)).to.be.equal(amount);
        });

        it('returns adjusted balance if user locked entr', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            const expiryTs = time.futureTimestamp(time.year);
            await kernel.connect(user).lock(expiryTs);

            const blockTs = await helpers.getLatestBlockTimestamp();

            expect(
                await kernel.votingPower(userAddress)
            ).to.be.equal(
                amount.mul(multiplierAtTs(expiryTs, blockTs)).div(helpers.tenPow18)
            );
        });
    });

    describe('votingPowerAtTs', async function () {
        it('returns correct balance with no lock', async function () {
            await prepareAccount(user, amount.mul(2));
            await kernel.connect(user).deposit(amount);

            const firstDepositTs = await helpers.getLatestBlockTimestamp();

            await helpers.setNextBlockTimestamp(firstDepositTs + 30 * time.day);
            await kernel.connect(user).deposit(amount);

            const secondDepositTs = await helpers.getLatestBlockTimestamp();

            expect(await kernel.votingPowerAtTs(userAddress, firstDepositTs - 10)).to.be.equal(0);
            expect(await kernel.votingPowerAtTs(userAddress, firstDepositTs + 10)).to.be.equal(amount);
            expect(await kernel.votingPowerAtTs(userAddress, secondDepositTs - 10)).to.be.equal(amount);
            expect(await kernel.votingPowerAtTs(userAddress, secondDepositTs + 10)).to.be.equal(amount.mul(2));
        });

        it('returns correct balance with lock', async function () {
            await prepareAccount(user, amount.mul(2));

            await kernel.connect(user).deposit(amount);
            const firstDepositTs = await helpers.getLatestBlockTimestamp();

            await helpers.setNextBlockTimestamp(firstDepositTs + 3600);

            const expiryTs = time.futureTimestamp(1 * time.year);
            await kernel.connect(user).lock(expiryTs);
            const lockTs = await helpers.getLatestBlockTimestamp();
            const expectedMultiplier = multiplierAtTs(expiryTs, lockTs + 10);
            const expectedBalance1 = amount.mul(expectedMultiplier).div(helpers.tenPow18);

            await helpers.setNextBlockTimestamp(lockTs + 3600);

            await kernel.connect(user).deposit(amount);
            const secondDepositTs = await helpers.getLatestBlockTimestamp();
            const expectedMultiplier2 = multiplierAtTs(expiryTs, secondDepositTs + 10);
            const expectedBalance2 = amount.mul(2).mul(expectedMultiplier2).div(helpers.tenPow18);

            expect(await kernel.votingPowerAtTs(userAddress, firstDepositTs - 10)).to.be.equal(0);
            expect(await kernel.votingPowerAtTs(userAddress, firstDepositTs + 10)).to.be.equal(amount);
            expect(await kernel.votingPowerAtTs(userAddress, lockTs + 10)).to.be.equal(expectedBalance1);
            expect(await kernel.votingPowerAtTs(userAddress, secondDepositTs + 10)).to.be.equal(expectedBalance2);
        });

        it('returns voting power with decaying bonus', async function () {
            await prepareAccount(user, amount.mul(2));
            await kernel.connect(user).deposit(amount);
            const ts = await helpers.getLatestBlockTimestamp();
            const startTs = ts + 10;

            await helpers.setNextBlockTimestamp(startTs);
            const expiryTs = startTs + time.year;
            await kernel.connect(user).lock(expiryTs);

            let bonus = helpers.tenPow18;
            const dec = helpers.tenPow18.div(10);

            for (let i = 0; i <= 365; i += 36.5) {
                const ts = startTs + i * time.day;
                const multiplier = helpers.tenPow18.add(bonus);
                const expectedVP = amount.mul(multiplier).div(helpers.tenPow18);

                expect(await kernel.votingPowerAtTs(userAddress, ts)).to.be.equal(expectedVP);

                bonus = bonus.sub(dec);
            }
        });
    });

    describe('delegate', async function () {
        it('reverts if user delegates to self', async function () {
            await expect(kernel.connect(user).delegate(userAddress)).to.be.revertedWith("Can't delegate to self");
        });

        it('reverts if user does not have balance', async function () {
            await prepareAccount(user, amount);

            await expect(kernel.connect(user).delegate(happyPirateAddress))
                .to.be.revertedWith('No balance to delegate');

            await kernel.connect(user).deposit(amount);

            await expect(kernel.connect(user).delegate(happyPirateAddress)).to.not.be.reverted;
        });

        it('sets the correct voting powers for delegate and delegatee', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            await kernel.connect(user).delegate(happyPirateAddress);

            expect(await kernel.votingPower(happyPirateAddress)).to.be.equal(amount);
            expect(await kernel.votingPower(userAddress)).to.be.equal(0);
        });

        it('sets the correct voting power if delegatee has own balance', async function () {
            await prepareAccount(user, amount);
            await prepareAccount(happyPirate, amount);
            await kernel.connect(user).deposit(amount);
            await kernel.connect(happyPirate).deposit(amount);

            await kernel.connect(user).delegate(happyPirateAddress);

            expect(await kernel.votingPower(happyPirateAddress)).to.be.equal(amount.mul(2));
            expect(await kernel.votingPower(userAddress)).to.be.equal(0);
        });

        it('sets the correct voting power if delegatee receives from multiple users', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);
            await kernel.connect(user).delegate(flyingParrotAddress);

            await prepareAccount(happyPirate, amount);
            await kernel.connect(happyPirate).deposit(amount);
            await kernel.connect(happyPirate).delegate(flyingParrotAddress);

            expect(await kernel.votingPower(flyingParrotAddress)).to.be.equal(amount.mul(2));

            await prepareAccount(flyingParrot, amount);
            await kernel.connect(flyingParrot).deposit(amount);

            expect(await kernel.votingPower(flyingParrotAddress)).to.be.equal(amount.mul(3));
        });

        it('records history of delegated power', async function () {
            await prepareAccount(user, amount.mul(2));
            await kernel.connect(user).deposit(amount);

            await prepareAccount(happyPirate, amount);
            await kernel.connect(happyPirate).deposit(amount);

            await kernel.connect(user).delegate(flyingParrotAddress);
            const delegate1Ts = await helpers.getLatestBlockTimestamp();

            await moveAtTimestamp(delegate1Ts + 100);
            await kernel.connect(happyPirate).delegate(flyingParrotAddress);
            const delegate2Ts = await helpers.getLatestBlockTimestamp();

            await moveAtTimestamp(delegate2Ts + 100);
            await kernel.connect(user).deposit(amount);
            const delegate3Ts = await helpers.getLatestBlockTimestamp();

            await moveAtTimestamp(delegate3Ts+100);
            await prepareAccount(flyingParrot, amount);
            await kernel.connect(flyingParrot).deposit(amount);
            const depositTs = await helpers.getLatestBlockTimestamp();

            expect(await kernel.votingPowerAtTs(flyingParrotAddress, depositTs -1)).to.be.equal(amount.mul(3));
            expect(await kernel.votingPowerAtTs(flyingParrotAddress, delegate3Ts - 1)).to.be.equal(amount.mul(2));
            expect(await kernel.votingPowerAtTs(flyingParrotAddress, delegate2Ts - 1)).to.be.equal(amount);
            expect(await kernel.votingPowerAtTs(flyingParrotAddress, delegate1Ts - 1)).to.be.equal(0);
        });

        it('does not modify user balance', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);
            await kernel.connect(user).delegate(happyPirateAddress);

            expect(await kernel.balanceOf(userAddress)).to.be.equal(amount);
        });

        it('works with multiple calls in the same block', async function () {
            const multicall = (await deploy.deployContract('MulticallMock', [kernel.address, entr.address])) as MulticallMock;

            await entr.mint(multicall.address, amount);

            await multicall.multiDelegate(amount, userAddress, happyPirateAddress);

            expect(await kernel.delegatedPower(userAddress)).to.equal(amount);
            expect(await kernel.delegatedPower(happyPirateAddress)).to.equal(0);
        });
    });

    describe('stopDelegate', async function () {
        it('removes delegated voting power from delegatee and returns it to user', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);
            await kernel.connect(user).delegate(happyPirateAddress);

            expect(await kernel.votingPower(userAddress)).to.be.equal(0);
            expect(await kernel.votingPower(happyPirateAddress)).to.be.equal(amount);

            await kernel.connect(user).stopDelegate();

            expect(await kernel.votingPower(userAddress)).to.be.equal(amount);
            expect(await kernel.votingPower(happyPirateAddress)).to.be.equal(0);
        });

        it('preserves delegate history', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);
            await kernel.connect(user).delegate(happyPirateAddress);
            const delegateTs = await helpers.getLatestBlockTimestamp();

            await kernel.connect(user).stopDelegate();
            const stopTs = await helpers.getLatestBlockTimestamp();

            expect(await kernel.votingPowerAtTs(happyPirateAddress, delegateTs - 1)).to.be.equal(0);
            expect(await kernel.votingPowerAtTs(happyPirateAddress, stopTs - 1)).to.be.equal(amount);
            expect(await kernel.votingPowerAtTs(happyPirateAddress, stopTs + 1)).to.be.equal(0);
        });

        it('does not change any other delegated balances for the delegatee', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);
            await kernel.connect(user).delegate(flyingParrotAddress);

            await prepareAccount(happyPirate, amount);
            await kernel.connect(happyPirate).deposit(amount);
            await kernel.connect(happyPirate).delegate(flyingParrotAddress);

            expect(await kernel.votingPower(flyingParrotAddress)).to.be.equal(amount.mul(2));

            await kernel.connect(user).stopDelegate();

            expect(await kernel.votingPower(flyingParrotAddress)).to.be.equal(amount);
        });
    });

    describe('events', async function () {
        it('emits Deposit on call to deposit()', async function () {
            await prepareAccount(happyPirate, amount);

            await expect(kernel.connect(happyPirate).deposit(amount))
                .to.emit(kernel, 'Deposit').and.not.emit(kernel, 'DelegatedPowerIncreased');
        });

        it('emits Deposit & DelegatedPowerIncreased on call to deposit() with delegated power', async function () {
            await prepareAccount(happyPirate, amount.mul(2));
            await kernel.connect(happyPirate).deposit(amount);

            await kernel.connect(happyPirate).delegate(flyingParrotAddress);

            await expect(kernel.connect(happyPirate).deposit(amount))
                .to.emit(kernel, 'Deposit')
                .and.to.emit(kernel, 'DelegatedPowerIncreased');
        });

        it('emits Withdraw on call to withdraw()', async function () {
            await prepareAccount(happyPirate, amount.mul(2));
            await kernel.connect(happyPirate).deposit(amount);

            await expect(kernel.connect(happyPirate).withdraw(amount))
                .to.emit(kernel, 'Withdraw')
                .and.not.to.emit(kernel, 'DelegatedPowerDecreased');
        });

        it('emits Withdraw & DelegatedPowerDecreased on call to withdraw() with delegated power', async function () {
            await prepareAccount(happyPirate, amount.mul(2));
            await kernel.connect(happyPirate).deposit(amount.mul(2));
            await kernel.connect(happyPirate).delegate(flyingParrotAddress);

            await expect(kernel.connect(happyPirate).withdraw(amount))
                .to.emit(kernel, 'Withdraw')
                .and.to.emit(kernel, 'DelegatedPowerDecreased');
        });

        it('emits correct events on delegate', async function () {
            await prepareAccount(happyPirate, amount.mul(2));
            await kernel.connect(happyPirate).deposit(amount.mul(2));

            // when a user delegates without currently delegating, we should see the following events
            await expect(kernel.connect(happyPirate).delegate(flyingParrotAddress))
                .to.emit(kernel, 'Delegate')
                .and.to.emit(kernel, 'DelegatedPowerIncreased')
                .and.not.to.emit(kernel, 'DelegatedPowerDecreased');

            // when a user changes the user they delegate to, we should see the following events
            await expect(kernel.connect(happyPirate).delegate(userAddress))
                .to.emit(kernel, 'Delegate')
                .and.to.emit(kernel, 'DelegatedPowerIncreased')
                .and.to.emit(kernel, 'DelegatedPowerDecreased');

            // on stopDelegate, it should emit a Delegate(user, address(0)) event
            await expect(kernel.connect(happyPirate).stopDelegate())
                .to.emit(kernel, 'Delegate')
                .and.to.emit(kernel, 'DelegatedPowerDecreased')
                .and.not.to.emit(kernel, 'DelegatedPowerIncreased');
        });

        it('emits Lock event on call to lock()', async function () {
            await prepareAccount(happyPirate, amount.mul(2));
            await kernel.connect(happyPirate).deposit(amount.mul(2));

            const ts = await helpers.getLatestBlockTimestamp();
            await expect(kernel.connect(happyPirate).lock(ts + 3600))
                .to.emit(kernel, 'Lock');
        });
    });

    describe('multiplierOf', function () {
        it('returns the current multiplier of the user', async function () {
            await prepareAccount(user, amount);
            await kernel.connect(user).deposit(amount);

            let ts: number = await helpers.getLatestBlockTimestamp();
            await helpers.setNextBlockTimestamp(ts + 5);

            const lockExpiryTs = ts + 5 + time.year;
            await kernel.connect(user).lock(lockExpiryTs);

            ts = await helpers.getLatestBlockTimestamp();

            const expectedMultiplier = multiplierAtTs(lockExpiryTs, ts);
            const actualMultiplier = await kernel.multiplierOf(userAddress);

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
        await entr.mint(await account.getAddress(), balance);
        await entr.connect(account).approve(kernel.address, balance);
    }

    function multiplierAtTs (expiryTs: number, ts: number): BigNumber {
        return BigNumber.from(expiryTs - ts)
            .mul(helpers.tenPow18)
            .div(time.year)
            .add(helpers.tenPow18);
    }
});
