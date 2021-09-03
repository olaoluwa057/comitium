import { task, HardhatUserConfig } from 'hardhat/config';
import * as config from './config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-abi-exporter';
import 'hardhat-typechain';
import 'solidity-coverage';
import 'hardhat-gas-reporter';

task('deploy', 'Deploys the Kernel Diamond with all of its facets')
    .addParam('entr', 'The ENTR token address')
    .addParam('cv', 'The community vault address')
    .addParam('start', 'The Start timestamp of the rewards')
    .addParam('end', 'The End timestamp of the rewards')
    .addParam('rewardsAmount', 'The reward amount')
    .setAction(async (args) => {
        const deployKernel = require('./scripts/deploy');
        await deployKernel(
            args.entr,
            args.cv,
            args.start,
            args.end,
            args.rewardsAmount);
    });

// Some of the settings should be defined in `./config.js`.
// Go to https://hardhat.org/config/ for the syntax.
const cfg: HardhatUserConfig = {
    solidity: {
        version: '0.7.6',
        settings: {
            optimizer: {
                enabled: true,
                runs: 9999,
            },
        },
    },

    defaultNetwork: 'hardhat',

    networks: config.networks,
    etherscan: config.etherscan,

    abiExporter: {
        only: ['Kernel', 'KernelFacet', 'OwnershipFacet', 'DiamondCutFacet', 'DiamondLoupeFacet', 'Rewards'],
        except: ['.*Mock$'],
        clear: true,
        flat: true,
    },

    gasReporter: {
        enabled: (process.env.REPORT_GAS) ? true : false,
    },
};

export default cfg;
