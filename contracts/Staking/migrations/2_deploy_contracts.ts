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

    deployer.deploy(IMDStaking, '0xf80eC7CB1DeE8e17F31Ebee3Eb0Ce31D1b6cab26', to18Decimals(10), to18Decimals(50), to18Decimals(10), 60);
  }
}
