require("ts-node").register({
  files: true,
});
require("dotenv").config();

const PrivateKeyProvider = require("truffle-privatekey-provider");

const ropstenProvider = new PrivateKeyProvider(process.env.ropsten_private, 'https://ropsten.infura.io/v3/6457ef867ef342bd8a903bb150924e91')
const rinkebyProvider = new PrivateKeyProvider(process.env.rinkeby_private, 'https://rinkeby.infura.io/v3/6457ef867ef342bd8a903bb150924e91')

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
   development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
     gasPrice: 100000000000,
   },
   test: {
     host: "127.0.0.1",
     port: 7545,
     gasPrice: 100000000000,
     network_id: "*",
   },
   ropsten: {
     provider: ropstenProvider,
     network_id: 3,
     gasPrice: 10000000000 // 10 gwei
   },
   rinkeby: {
     provider: rinkebyProvider,
     network_id: 4,
     gasPrice: 10000000000 // 10 gwei
   }
  },
  compilers: {
    solc: {
      version: "0.8.9",
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: '4QBZ6FA5BK2BBW78ZSN1GZRGCPIGX63VAN'
  }
  //
  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
    // enabled: false,
    // host: "127.0.0.1",
    // adapter: {
    //   name: "sqlite",
    //   settings: {
    //     directory: ".db"
    //   }
    // }
  // }
};
