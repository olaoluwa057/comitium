import * as helpers from '../test/helpers/helpers';
import { Contract } from 'ethers';
import * as deploy from '../test/helpers/deploy';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

const facetAddresses = new Map([
    ['DiamondCutFacet', '0x9d1c7F3670533487a22767Da6a8CEdE1b00C3c53'],
    ['DiamondLoupeFacet', '0x151586da6d89345C839DdCc0F290f425B8B10AEB'],
    ['OwnershipFacet', '0x45c1a21C800119aF24F9968380D5570A25C3cb8F'],
]);

const _entr = '0x86dEddCFc3a7DBeE68cDADA65Eed3D3b70F4fe24';
const _owner = '0x39aE4d18f1feb3708CaCCC39F1Af3e8C26D577d5';
const _kernel = '0xFa7f183d5DDe994a908CA1969c50AE7538b60D8d';

// needed for rewards setup
const _cv = '0x3317cc09ce0da6751b4E0b7c56114bA833D3d232';
const startTs = 1621337400;
const endTs = 1642982400;
const rewardsAmount = BigNumber.from(50000).mul(helpers.tenPow18);

async function main () {
    const diamond = await ethers.getContractAt('Kernel', _kernel);
    //const rewards = await ethers.getContractAt('Rewards', _rewards);

    const rewards = await deploy.deployContract('Rewards', [_owner, _entr, diamond.address]);
    console.log(`Rewards deployed at: ${rewards.address}`);

    await rewards.setupPullToken(_cv, startTs, endTs, rewardsAmount);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
