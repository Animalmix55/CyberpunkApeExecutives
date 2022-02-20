import BN from 'bn.js';

module.exports = (artifacts: Truffle.Artifacts) => {
    const LegendsContract = artifacts.require('CyberpunkApeLegends');
    const Staking = artifacts.require('IMDStaking');

    const to18Decimals = (amount: number): BN => {
        return new BN(amount).mul(new BN(10).pow(new BN(18)));
    };

    return async (deployer: Truffle.Deployer) => {
        const stakingInstance = await Staking.deployed();
        const { address: legendsAddress } = await LegendsContract.deployed();

        await stakingInstance.addStakableToken(
            legendsAddress,
            to18Decimals(5),
            to18Decimals(15),
            to18Decimals(5),
            60 * 10 // 10 minutes
        );

        return deployer;
    };
};
