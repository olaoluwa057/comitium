import * as helpers from '../../test/helpers/helpers';
import { Contract } from 'ethers';
import * as deploy from '../../test/helpers/deploy';
import { diamondAsFacet } from '../../test/helpers/diamond';
import { KernelFacet } from '../../typechain';

// Default Facets must be deployed before the Diamond!
const facetAddresses = new Map([
    ['DiamondCutFacet', 'TODO'],
    ['DiamondLoupeFacet', 'TODO'],
    ['OwnershipFacet', 'TODO'],
]);

const _entr = '0x86dEddCFc3a7DBeE68cDADA65Eed3D3b70F4fe24';
const _owner = '0x39aE4d18f1feb3708CaCCC39F1Af3e8C26D577d5';

async function main () {
    const facets = await getFacets();

    // Deployment of Change Rewards Facet
    const crf = await deploy.deployContract('ChangeRewardsFacet');
    facets.push(crf);
    console.log(`ChangeRewardsFacet deployed to: ${crf.address}`);

    // Deployment of Kernel Facet
    const KernelFacet = await deploy.deployContract('KernelFacet');
    facets.push(KernelFacet);
    console.log(`KernelFacet deployed at: ${KernelFacet.address}`);

    const diamond = await deploy.deployDiamond(
        'Kernel',
        facets,
        _owner,
    );
    console.log(`Kernel (Diamond) deployed at: ${diamond.address}`);

    // Deployment of Rewards
    const rewards = await deploy.deployContract('Rewards', [_owner, _entr, diamond.address]);
    console.log(`Rewards deployed at: ${rewards.address}`);

    // Initialising the Kernel Facet
    console.log('Calling initKernel');
    const kernel = (await diamondAsFacet(diamond, 'KernelFacet')) as KernelFacet;
    await kernel.initKernel(_entr, rewards.address);
}

async function getFacets (): Promise<Contract[]> {
    const facets: Contract[] = [];

    for (const key of facetAddresses.keys()) {
        facets.push(await helpers.contractAt(key, facetAddresses.get(key) || ''));
    }

    return facets;
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
