import { Contract } from 'ethers';
import * as helpers from '../test/helpers/helpers';
import * as diamond from '../test/helpers/diamond';

const facetAddresses = new Map([
    ['DiamondCutFacet', '0xD4440dC5A06182f0e936C3a1B2472b3F16E29f62'],
    ['DiamondLoupeFacet', '0xC550FAcBB8E2C4483aa0f84774b2C2E06e38f958'],
    ['OwnershipFacet', '0x1B2D2C069fCF035d865E439Bb1B5584524FD87ce'],
    ['ChangeRewardsFacet', '0x01C7224D42De4b11451E8BfBE721ccaFe79fe1c5'],
    ['KernelFacet', '0x6A1819f39596ADd71F22c0777B161f278DFc882a'],
]);

async function getFacets (): Promise<Contract[]> {
    const facets: Contract[] = [];

    for (const key of facetAddresses.keys()) {
        facets.push(await helpers.contractAt(key, facetAddresses.get(key) || ''));
    }

    return facets;
}

async function getCut () {
    const diamondCut = [];

    for (const facet of (await getFacets())) {
        diamondCut.push([
            facet.address,
            diamond.FacetCutAction.Add,
            diamond.getSelectors(facet),
        ]);
    }

    return diamondCut;
}

// todo: use the following code to generate the actual diamondCut in the console, then copy it here
// todo: could not find a better way :(
// async function main () {
//     console.log(await getCut());
// }
// main()
//     .then(() => process.exit(0))
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });

module.exports = [
    [
        ['0xD4440dC5A06182f0e936C3a1B2472b3F16E29f62', 0, ['0x1f931c1c']],
        [
            '0xC550FAcBB8E2C4483aa0f84774b2C2E06e38f958',
            0,
            [
                '0xcdffacc6',
                '0x52ef6b2c',
                '0xadfca15e',
                '0x7a0ed627',
                '0x01ffc9a7',
            ],
        ],
        [
            '0x1B2D2C069fCF035d865E439Bb1B5584524FD87ce',
            0,
            [ '0x8da5cb5b', '0xf2fde38b' ],
        ],
        [ '0x01C7224D42De4b11451E8BfBE721ccaFe79fe1c5', 0, [ '0x8d240d8b' ] ],
        [
            '0x6A1819f39596ADd71F22c0777B161f278DFc882a',
            0,
            [
                '0x65a5d5f0', '0x417edd4d',
                '0x70a08231', '0x5c19a95c',
                '0x169df064', '0xd265a115',
                '0xb6b55f25', '0xbfc10279',
                '0xc5434072', '0x4df9f446',
                '0xd828d101', '0xdd467064',
                '0x7a141096', '0x8e4a5248',
                '0x18ab6a3c', '0x6f121578',
                '0xbef624d8', '0xbf0ae48c',
                '0xc07473f6', '0xcbf8eda9',
                '0x2e1a7d4d',
            ],
        ],
    ],
    '0x66D13c577Af9B2Ae16f222eC0338f426FcA399d0',
];
