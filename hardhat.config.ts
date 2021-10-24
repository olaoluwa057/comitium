import { task, HardhatUserConfig } from 'hardhat/config';
import * as config from './config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-abi-exporter';
import 'hardhat-typechain';
import 'solidity-coverage';
import 'hardhat-gas-reporter';

task('deploy', 'Deploys the Comitium Diamond with all of its facets')
    .addParam('fdt', 'The FDT token address')
    .addParam('cv', 'The community vault address')
    .addParam('start', 'The Start timestamp of the rewards')
    .addParam('days', 'The number of days the rewards should run')
    .addParam('rewardsAmount', 'The reward amount')
    .setAction(async (args) => {
        const deployComitium = require('./scripts/deploy');
        await deployComitium(
            args.fdt,
            args.cv,
            args.start,
            args.days,
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
        only: ['Comitium', 'ComitiumFacet', 'OwnershipFacet', 'DiamondCutFacet', 'DiamondLoupeFacet', 'Rewards'],
        except: ['.*Mock$'],
        clear: true,
        flat: true,
    },

    gasReporter: {
        enabled: (process.env.REPORT_GAS) ? true : false,
    },
};

export default cfg;
