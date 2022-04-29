import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

import { HardhatUserConfig } from 'hardhat/types/config';
import "@nomiclabs/hardhat-ethers";
import '@nomiclabs/hardhat-waffle';
import "@nomiclabs/hardhat-web3";
import "hardhat-abi-exporter";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@typechain/hardhat";
import "hardhat-gas-reporter";


let config: HardhatUserConfig = {
    defaultNetwork: 'hardhat',
    solidity: {
        version: '0.8.9',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        prodMainnet: {
            url: process.env.PROD_RPC,
            accounts: [process.env.PROD_ACCOUNT_PRIVATE_KEY], 
        },
        hardhat: {
            chainId: 1337,
            forking: {
                url: process.env.DEV_RPC!,
                blockNumber: 14679632,
            },
            loggingEnabled: true,
            blockGasLimit: 0x1fffffffffffff,
            accounts: [{
                privateKey: '0x27f64677f87074404da76c1dd2530c3491322d13a19b8195f1a6b2af3b0e633f',
                balance: '100000000000000000000000000000000000000000',
            }],
            gas: 120e9,
        },
    },
    abiExporter: {
        path: './abi',
    },
    mocha: {
        reporter: 'eth-gas-reporter',
        timeout: 300000,
    },
};
export default config;