import BN from "bn.js";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  const RooTroopContract = artifacts.require("RooTroop");
  const SignerContract = artifacts.require("VerifySignature");

  return async (
    deployer: Truffle.Deployer,
  ) => {
    const signer = web3.eth.accounts.privateKeyToAccount('0x8ccd4de560ecb846bedb8247c6824f451e7cccedc9d734ec448a3cec5f56b93a');
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2055, 1).valueOf() / 1000);
  
    deployer.deploy(SignerContract);
    deployer.link(SignerContract, RooTroopContract);
    deployer.deploy(RooTroopContract, 5500, 250, 1000, 10, new BN('42000000000000000'), signer.address, now + 60, later, now + 90, later, now + 200);
  }
}
