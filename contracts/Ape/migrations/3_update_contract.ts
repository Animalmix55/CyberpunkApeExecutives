import BN from "bn.js";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  const CyberpunkApeExecutivesContract = artifacts.require("CyberpunkApeExecutives");
  const SignerContract = artifacts.require("VerifySignature");

  return async (
    deployer: Truffle.Deployer,
  ) => {
    const contract = await CyberpunkApeExecutivesContract.deployed()
    await contract.setBaseURI('https://cc_nftstore.mypinata.cloud/ipfs/QmNwf7LEdghyqntvdkxyomMZ2Jc4Y9Z6Ks76JitGctMvBb/');
    await contract.mint('20');
  }
}
