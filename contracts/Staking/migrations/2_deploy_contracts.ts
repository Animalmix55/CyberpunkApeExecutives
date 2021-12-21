import BN from "bn.js";
declare const config: any;

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  const IMDStaking = artifacts.require('IMDStaking');

  const to18Decimals = (amount: number): BN => {
    return new BN(amount).mul(new BN(10 ^ 18));
  }
  
  return async (
    deployer: Truffle.Deployer,
  ) => {
    const network = config.network;
    const yieldPeriod = network === 'test' ? 60 : 60 * 60 * 24 * 7;

    deployer.deploy(IMDStaking, '0xA5216Fc347269aF60B0d6237d647743c6456520A', to18Decimals(10), to18Decimals(50), to18Decimals(10), yieldPeriod);
  }
}
