import hardhat from 'hardhat';
import * as deployer from '../utils/deploy';
import { KernelFacet, OwnershipFacet, Rewards } from "../typechain";
import { getDiamondCut } from "../utils/deploy";
import { diamondAsFacet } from "../utils/diamond";

async function deploy(entr: string, cv: string, sStart: string, sDays: string, rewardsAmount: string) {
    const days = Number.parseInt(sDays);
    const start = Number.parseInt(sStart)

    await hardhat.run('compile');
    const deployers = await hardhat.ethers.getSigners();
    const deployerAddress = await deployers[0].getAddress();

    /**
     * Deploying Kernel
     */
    console.log('Deploying DiamondCutFacet...');
    const cutFacet = await deployer.deployContract('DiamondCutFacet');
    console.log(`DiamondCutFacet deployed to: ${cutFacet.address}`);

    console.log('Deploying DiamondLoupeFacet...');
    const loupeFacet = await deployer.deployContract('DiamondLoupeFacet');
    console.log(`DiamondLoupeFacet deployed to: ${loupeFacet.address}`);

    console.log('Deploying OwnershipFacet...');
    const ownershipFacet = await deployer.deployContract('OwnershipFacet');
    console.log(`OwnershipFacet deployed to: ${ownershipFacet.address}`);

    console.log('Deploying ChangeRewardsFacet...');
    const crf = await deployer.deployContract('ChangeRewardsFacet');
    console.log(`ChangeRewardsFacet deployed to: ${crf.address}`);

    console.log('Deploying KernelFacet...');
    const kernelFacet = await deployer.deployContract('KernelFacet');
    console.log(`KernelFacet deployed at: ${kernelFacet.address}`);

    console.log('Deploying Kernel (Diamond)...');
    const diamond = await deployer.deployDiamond(
        'Kernel',
        [cutFacet, loupeFacet, ownershipFacet, crf, kernelFacet],
        deployerAddress,
    );
    console.log(`Kernel (Diamond) deployed at: ${diamond.address}`);

    /**
     * Deploying Rewards
     */
    console.log('Deploying Rewards...');
    const rewards = (await deployer.deployContract('Rewards', [deployerAddress, entr, diamond.address])) as Rewards;
    console.log(`Rewards deployed at: ${rewards.address}`);

    console.log('Setup Rewards...');
    await rewards.setupPullToken(cv, start, start + (60 * 60 * 24 * days), rewardsAmount);
    console.log(`Rewards have been set up. Go ahead and approve ${rewardsAmount} from the Community Vault`);

    /**
     * Initialise Kernel
     */
    console.log('Initialising Kernel...');
    const kf = (await diamondAsFacet(diamond, 'KernelFacet')) as KernelFacet;
    await kf.initKernel(entr, rewards.address);
    console.log('Initialised Kernel');

    /**
     * Verify Contracts
     */
    console.log('Verifying DiamondCutFacet on Etherscan...');
    await hardhat.run('verify:verify', {
        address: cutFacet.address,
        constructorArguments: []
    });

    console.log('Verifying DiamondLoupeFacet on Etherscan...');
    await hardhat.run('verify:verify', {
        address: loupeFacet.address,
        constructorArguments: []
    });

    console.log('Verifying OwnershipFacet on Etherscan...');
    await hardhat.run('verify:verify', {
        address: ownershipFacet.address,
        constructorArguments: []
    });

    console.log('Verifying ChangeRewardsFacet on Etherscan...');
    await hardhat.run('verify:verify', {
        address: crf.address,
        constructorArguments: []
    });

    console.log('Verifying KernelFacet on Etherscan...');
    await hardhat.run('verify:verify', {
        address: kernelFacet.address,
        constructorArguments: []
    });

    console.log('Verifying Kernel (Diamond) on Etherscan...');
    await hardhat.run('verify:verify', {
        address: diamond.address,
        constructorArguments: [
            getDiamondCut([cutFacet, loupeFacet, ownershipFacet, crf, kernelFacet]),
            deployerAddress
        ]
    });

    console.log('Verifying Rewards on Etherscan...');
    await hardhat.run('verify:verify', {
        address: rewards.address,
        constructorArguments: [deployerAddress, entr, diamond.address]
    });

    console.log(`Finished Deployment!`);
    console.log('DiamondCutFacet address: ', cutFacet.address);
    console.log('DiamondLoupeFacet address: ', loupeFacet.address);
    console.log('OwnershipFacet address: ', ownershipFacet.address);
    console.log('ChangeRewardsFacet address: ', crf.address);
    console.log('KernelFacet address: ', kernelFacet.address);
    console.log('Kernel (Diamond) address: ', diamond.address);
    console.log('Rewards address:', rewards.address);
}

module.exports = deploy;
