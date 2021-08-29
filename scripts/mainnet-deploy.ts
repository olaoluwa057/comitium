import * as deploy from '../test/helpers/deploy';
import { diamondAsFacet } from '../test/helpers/diamond';
import { KernelFacet, Rewards } from '../typechain';
import { BigNumber } from 'ethers';
import * as helpers from '../test/helpers/helpers';

const _owner = '0x89d652C64d7CeE18F5DF53B24d9D29D130b18798';
const _entr = '0x0391D2021f89DC339F60Fff84546EA23E337750f';

// needed for rewards setup
const _cv = '0xA3C299eEE1998F45c20010276684921EBE6423D9';
const startTs = 1612742400;
const endTs = 1642982400;
const rewardsAmount = BigNumber.from(610000).mul(helpers.tenPow18);

async function main () {
    const cutFacet = await deploy.deployContract('DiamondCutFacet');
    console.log(`DiamondCutFacet deployed to: ${cutFacet.address}`);

    const loupeFacet = await deploy.deployContract('DiamondLoupeFacet');
    console.log(`DiamondLoupeFacet deployed to: ${loupeFacet.address}`);

    const ownershipFacet = await deploy.deployContract('OwnershipFacet');
    console.log(`OwnershipFacet deployed to: ${ownershipFacet.address}`);

    const crf = await deploy.deployContract('ChangeRewardsFacet');
    console.log(`ChangeRewardsFacet deployed to: ${crf.address}`);

    const KernelFacet = await deploy.deployContract('KernelFacet');
    console.log(`KernelFacet deployed at: ${KernelFacet.address}`);

    const diamond = await deploy.deployDiamond(
        'Kernel',
        [cutFacet, loupeFacet, ownershipFacet, crf, KernelFacet],
        _owner,
    );
    console.log(`Kernel deployed at: ${diamond.address}`);

    const rewards = (await deploy.deployContract('Rewards', [_owner, _entr, diamond.address])) as Rewards;
    console.log(`Rewards deployed at: ${rewards.address}`);

    console.log('Calling initKernel');
    const kernel = (await diamondAsFacet(diamond, 'KernelFacet')) as KernelFacet;
    await kernel.initKernel(_entr, rewards.address);

    await rewards.setupPullToken(_cv, startTs, endTs, rewardsAmount);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
