import * as deploy from '../test/helpers/deploy';
import { diamondAsFacet } from '../test/helpers/diamond';
import { KernelFacet, Rewards } from '../typechain';
import { BigNumber } from 'ethers';
import * as helpers from '../test/helpers/helpers';

const OWNER = '0x66D13c577Af9B2Ae16f222eC0338f426FcA399d0';
const ENTR = '0x822a5c31679f4A580dEb6aE4596437AcDB9DDcAb';

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
        OWNER,
    );
    console.log(`Kernel deployed at: ${diamond.address}`);

    const rewards = (await deploy.deployContract('Rewards', [OWNER, ENTR, diamond.address])) as Rewards;
    console.log(`Rewards deployed at: ${rewards.address}`);

    console.log('Calling initKernel');
    const kernel = (await diamondAsFacet(diamond, 'KernelFacet')) as KernelFacet;
    await kernel.initKernel(ENTR, rewards.address);

    // await rewards.setupPullToken(_cv, startTs, endTs, rewardsAmount);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
