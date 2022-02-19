/* eslint-disable @typescript-eslint/no-var-requires */
require('ts-node').register({
    files: true,
});
require('dotenv').config();

// const HDWalletProvider = require('@truffle/hdwallet-provider');

// const rinkebyProvider = new HDWalletProvider(
//     process.env.rinkeby_secret,
//     process.env.rinkeby_provider
// );

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 7545,
            network_id: '*',
        },
        test: {
            host: '127.0.0.1',
            port: 7545,
            network_id: '*',
        },
        // rinkeby: {
        //     provider: rinkebyProvider,
        //     network_id: 4,
        //     gasPrice: 10000000000, // 10 gwei
        // },
    },
    compilers: {
        solc: {
            version: '0.8.9',
        },
    },
    plugins: ['truffle-plugin-verify'],
    api_keys: {
        etherscan: process.env.etherscan_api_key,
    },
};
