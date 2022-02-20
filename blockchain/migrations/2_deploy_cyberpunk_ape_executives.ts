import BN from 'bn.js';

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
    const CyberpunkApeExecutivesContract = artifacts.require(
        'CyberpunkApeExecutives'
    );
    const SignerContract = artifacts.require('VerifySignature');

    return async (deployer: Truffle.Deployer) => {
        const { whitelist_signer } = process.env;
        if (!whitelist_signer) throw new Error('Missing signer');
        const signer = web3.eth.accounts.privateKeyToAccount(whitelist_signer);
        const now = Math.floor(new Date().valueOf() / 1000);
        const later = Math.floor(new Date(2055, 1).valueOf() / 1000);

        deployer.deploy(SignerContract);
        deployer.link(SignerContract, CyberpunkApeExecutivesContract);
        deployer.deploy(
            CyberpunkApeExecutivesContract,
            5500,
            1000,
            10,
            new BN('42000000000000000'),
            signer.address,
            now + 90,
            later,
            later
        );
    };
};
