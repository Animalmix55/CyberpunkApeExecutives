import BN from "bn.js";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  const CyberpunkApeExecutivesContract = artifacts.require("CyberpunkApeExecutives");
  const SignerContract = artifacts.require("VerifySignature");

  return async (
    deployer: Truffle.Deployer,
  ) => {
    const signer = web3.eth.accounts.privateKeyToAccount('0x8ccd4de560ecb846bedb8247c6824f451e7cccedc9d734ec448a3cec5f56b93a');
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2055, 1).valueOf() / 1000);
  
    deployer.deploy(SignerContract);
    deployer.link(SignerContract, CyberpunkApeExecutivesContract);
    deployer.deploy(CyberpunkApeExecutivesContract, 5500, 1000, 10, new BN('42000000000000000'), signer.address, now + 90, later, later);
  }
}
