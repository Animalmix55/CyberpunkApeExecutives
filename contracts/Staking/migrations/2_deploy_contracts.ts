import BN from "bn.js";
declare const config: any;

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  const IMDStaking = artifacts.require('IMDStaking');

  const to18Decimals = (amount: number): BN => {
    return new BN(amount).mul(new BN(10).pow(new BN(18)));
  }
  
  return async (
    deployer: Truffle.Deployer,
  ) => {
    // const network = config.network;
    // const yieldPeriod = network === 'test' ? 60 : 60 * 60 * 24 * 7;

    deployer.deploy(IMDStaking, '0xf0a40BC72091e29f56bb658a33391EB1D7d02973', to18Decimals(10), to18Decimals(50), to18Decimals(10), 60);
  }
}
