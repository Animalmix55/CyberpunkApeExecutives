import BN from "bn.js";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  const IMDStaking = artifacts.require('IMDStaking');

  const to18Decimals = (amount: number): BN => {
    return new BN(amount).mul(new BN(10 ^ 18));
  }
  
  return async (
    deployer: Truffle.Deployer,
  ) => {
    deployer.deploy(IMDStaking, web3.eth.accounts.create().address, to18Decimals(10), to18Decimals(50), to18Decimals(10), 60 * 60 * 24 * 7);
  }
}
