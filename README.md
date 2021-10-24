# FiatDao Comitium

Implements continuous rewards for staking FDT in the DAO. Implements logic for determining DAO voting power based upon amount of FDT deposited (which becomes vFDT) plus a multiplier (up to 2x) awarded to those who lock their FDT in the DAO for a specified period (up to 1 year). Those that lock their vFDT for 1 year receive a 2x multiplier; those that lock their vFDT for 6 months receive a 1.5x multiplier, and so on. Also allows users to delegate their vFDT voting power to a secondary wallet address.
**NOTE:** The vFDT multiplier ONLY affects voting power; it does NOT affect rewards. All users who stake FDT receive the same reward rate regardless of the amount of time they have locked or not locked.

##  Contracts
### Comitium.sol
Allows users to deposit FDT into the DAO, withdraw it, lock for a time period to increase their voting power (does not affect rewards), and delegate their vFDT voting power to a secondary wallet address. Interacts with [Rewards.sol](https://github.com/FiatDAO/FIAT-Comitium/blob/master/contracts/Rewards.sol) contract to check balances and update upon deposit/withdraw. Interacts with [Governance.sol](https://github.com/FiatDAO/FIAT-DAO/blob/master/contracts/Governance.sol) contract to specify how much voting power (vFDT) a wallet address has for use in voting on or creating DAO proposals.
#### Actions
- deposit
- withdraw
- lock
- delegate

### Rewards.sol
Rewards users who stake their FDT on a continuous basis. Allows users to Claim their rewards which are then Transfered to their wallet. Interacts with the [CommunityVault.sol](https://github.com/FIAT-DAO/FIAT-YieldFarming/blob/master/contracts/CommunityVault.sol) which is the source of the FDT rewards. The `Comitium` contract calls the `registerUserAction` hook on each `deposit`/`withdraw` the user executes, and sends the results to the `Rewards` contract.
#### How it works
1. every time the `acKFunds` function detects a balance change, the multiplier is recalculated by the following formula:
```
newMultiplier = oldMultiplier + amountAdded / totalFDTStaked
```
2. whenever a user action is registered (either by automatic calls from the hook or by user action (claim)), we calculate the amount owed to the user by the following formula:
```
newOwed = currentlyOwed + userBalance * (currentMultiplier - oldUserMultiplier)

where:
- oldUserMultiplier is the multiplier at the time of last user action
- userBalance = comitium.balanceOf(user) -- the amount of $FDT staked into the Comitium
```
3. update the oldUserMultiplier with the current multiplier -- signaling that we already calculated how much was owed to the user since his last action

## Smart Contract Architecture
FiatDao Comitium is a fork of BarnBridge Barn. It shares the same architecture:

![dao sc architecture](https://user-images.githubusercontent.com/4047772/120464398-8c8cf400-c3a5-11eb-8cb8-a105eeaaa9e9.png)


Check out more detailed smart contract Slither graphs with all the dependencies: [BarnBridge-Barn Slither Graphs](https://github.com/BarnBridge/sc-graphs/tree/main/BarnBridge-Barn).

### Specs
- user can stake FDT for vFDT
    - user can lock FDT for a period up to 1 year and he gets a bonus of vFDT
        - bonus is linear, max 1 year, max 2x multiplier
            - example:
                - lock 1000 FDT for 1 year → get back 2000 vFDT
                - lock 1000 FDT for 6 months → get back 1500 vFDT
        - bonus has a linear decay relative to locking duration
            - example: lock 1000 FDT for 1 year, get back 2000 vFDT at T0 → after 6 months, balance is 1500 vFDT → after 9 months, balance is 1250 vFDT
        - user can only withdraw their FDT balance after lock expires
    - user can keep FDT unlocked and no bonus is applied, vFDT balance = FDT balance
- user can stake more FDT
    - no lock → just get back the same amount of vFDT
    - lock
        - lock period stays the same
            - base balance is increased with the added FDT
            - multiplier stays the same
        - lock period is extended
            - base balance is increased with the added FDT
                - multiplier is recalculated relative to the new lock expiration date
- user can delegate vFDT to another user
    - there can be only one delegatee at a time
    - only actual balance can be delegated, not the bonus
    - delegated balance cannot be locked
    - user can take back the delegated vFDTs at any time



## Initial Setup
### Install NVM and the latest version of NodeJS 12.x
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    # Restart terminal and/or run commands given at the end of the installation script
    nvm install 12
    nvm use 12
### Use Git to pull down the FiatDao Comitium repository from GitHub
    git clone git@github.com:FiatDAO/FIAT-Comitium.git
    cd FIAT-Comitium
### Create config.ts using the sample template config.sample.ts
    cp config.sample.ts config.ts

## Updating the config.ts file
### Create an API key with Infura to deploy to Ethereum Public Testnet. In this guide, we are using Kovan.

1. Navigate to [Infura.io](https://infura.io/) and create an account
2. Log in and select "Get started and create your first project to access the Ethereum network"
3. Create a project and name it appropriately
4. Then, switch the endpoint to Rinkeby, copy the https URL and paste it into the section named `rinkeby`
5. Finally, insert the mnemonic phrase for your testing wallet. You can use a MetaMask instance, and switch the network to Rinkeby on the upper right. DO NOT USE YOUR PERSONAL METAMASK SEED PHRASE; USE A DIFFERENT BROWSER WITH AN INDEPENDENT METAMASK INSTALLATION
6. You'll need some Kovan-ETH (it is free) in order to pay the gas costs of deploying the contracts on the TestNet; you can use your GitHub account to authenticate to the [KovanFaucet](https://faucet.kovan.network/) and receive 2 Kovan-ETH for free every 24 hours

### Create an API key with Etherscan
1. Navigate to [EtherScan](https://etherscan.io/) and create an account
2. Log in and navigate to [MyAPIKey](https://etherscan.io/myapikey)
3. Use the Add button to create an API key, and paste it into the indicated section towards the bottom of the `config.ts` file

### Verify contents of config.ts; it should look like this:

```js
        import { NetworksUserConfig } from "hardhat/types";
        import { EtherscanConfig } from "@nomiclabs/hardhat-etherscan/dist/src/types";

        export const networks: NetworksUserConfig = {
            // Needed for `solidity-coverage`
            coverage: {
                url: "http://localhost:8555"
            },

            // Kovan
            kovan: {
                url: "https://kovan.infura.io/v3/INFURA-API-KEY",
                chainId: 42,
                accounts: {
                    mnemonic: "YourKovanTestWalletMnemonicPhrase",
                    path: "m/44'/60'/0'/0",
                    initialIndex: 0,
                    count: 10
                },
                gas: 3716887,
                gasPrice: 20000000000, // 20 gwei
                gasMultiplier: 1.5
            },

            // Mainnet
            mainnet: {
                url: "https://mainnet.infura.io/v3/YOUR-INFURA-KEY",
                chainId: 1,
                accounts: ["0xaaaa"],
                gas: "auto",
                gasPrice: 50000000000,
                gasMultiplier: 1.5
            }
        };

        // Use to verify contracts on Etherscan
        // https://buidler.dev/plugins/nomiclabs-buidler-etherscan.html
        export const etherscan: EtherscanConfig = {
            apiKey: "YourEtherscanAPIKey"
        };

```
## Installing

### Install NodeJS dependencies which include HardHat
    npm install

### Compile the contracts
    npm run compile

## Running Tests
    npm run test

**Note:** The result of tests is readily available [here](./test-results.md).
## Running Code Coverage Tests
    npm run coverage

## Audits
FiatDao Comitium is a fork of BarnBridge Barn. Here you can find the audits for the original contract:

- [QuantStamp](https://github.com/BarnBridge/BarnBridge-PM/blob/master/audits/BarnBridge%20DAO%20audit%20by%20Quanstamp.pdf)
- [Haechi](https://github.com/BarnBridge/BarnBridge-PM/blob/master/audits/BarnBridge%20DAO%20audit%20by%20Haechi.pdf)

## Deployment

- Deploys all the facets
- Deploys the Comitium Diamond with all the facets as diamond cuts
- Deploys the Rewards contract
- Configures the Pull Token
- Verifies all contracts at Etherscan
```
npx hardhat deploy \
    --network <network name> \ 
    --fdt <FDT token> \
    --cv <community vault address> \
    --start <start timestamp for rewards> \
    --end <end timestamp for rewards> \
    --rewards-amount <rewards amount> \
```

### Mainnet
```shell
DiamondCutFacet deployed to: 0xCD98aFdc3f8B56daa318eBa929F1A865AeE7cc4f
DiamondLoupeFacet deployed to: 0xEdf1BcC415f60989c176834E8fd5eAcbd86b9aA2
OwnershipFacet deployed to: 0x9f34eCc82405Dc4eb220B46FA70Bfba5AfA802BF
ChangeRewardsFacet deployed to: 0xe915D9dc6FBdEe48FDEa4F832C69Dc283588bA61
ComitiumFacet deployed at: 0xa6bE5520c1d2f443E346B93330F55dC7Cfb23b9B
-----
Comitium deployed at: 0xD2c83AB0bee469ab5853c1e60bf8B663094EDca5
Rewards deployed at: 0xe4eD7DBF867c4C3Dd24D31Dc55F4A475634a5851
```

### Rinkeby
```shell
DiamondCutFacet deployed to: 0xD4440dC5A06182f0e936C3a1B2472b3F16E29f62
DiamondLoupeFacet deployed to: 0xC550FAcBB8E2C4483aa0f84774b2C2E06e38f958
OwnershipFacet deployed to: 0x1B2D2C069fCF035d865E439Bb1B5584524FD87ce
ChangeRewardsFacet deployed to: 0x01C7224D42De4b11451E8BfBE721ccaFe79fe1c5
ComitiumFacet deployed at: 0x6A1819f39596ADd71F22c0777B161f278DFc882a
-----
Comitium deployed at: 0x48fc1fc9F88fdc98302E40aF50B32B06dDeB7713
Rewards deployed at: 0x9778409eF13D797F9218dC71bcfc368976D47B5d
```

## Discussion
For any concerns with the platform, open an issue on GitHub.
