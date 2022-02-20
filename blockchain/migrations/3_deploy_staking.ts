import BN from 'bn.js';

module.exports = (artifacts: Truffle.Artifacts) => {
    const IMDStaking = artifacts.require('IMDStaking');
    const CyberpunkApeExecutives = artifacts.require('CyberpunkApeExecutives');

    const to18Decimals = (amount: number): BN => {
        return new BN(amount).mul(new BN(10).pow(new BN(18)));
    };

    return async (deployer: Truffle.Deployer) => {
        return deployer.deploy(
            IMDStaking,
            (await CyberpunkApeExecutives.deployed()).address,
            to18Decimals(10),
            to18Decimals(50),
            to18Decimals(10),
            60
        );
    };
};
