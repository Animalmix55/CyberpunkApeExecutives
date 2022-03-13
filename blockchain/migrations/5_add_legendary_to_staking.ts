import BN from 'bn.js';

module.exports = (artifacts: Truffle.Artifacts) => {
    const LegendsContract = artifacts.require('CyberpunkApeLegends');
    const Staking = artifacts.require('IMDStaking');

    const to18Decimals = (amount: number): BN => {
        return new BN(amount).mul(new BN(10).pow(new BN(18)));
    };

    return async (deployer: Truffle.Deployer) => {
        const stakingInstance = await Staking.deployed();
        const legendsInstance = await LegendsContract.deployed();

        const exceptions = [
            325, 375, 375, 375, 375, 375, 375, 325, 325, 325, 325, 375, 375,
            375, 375, 375, 375, 400, 400, 400, 375, 375, 450, 375, 375, 400,
        ].map((v) => `${v}000000000000000000`);

        await legendsInstance.setMintPriceOverrides(1, exceptions);

        await stakingInstance.addStakableToken(
            legendsInstance.address,
            to18Decimals(5),
            to18Decimals(15),
            to18Decimals(5),
            60 * 10 // 10 minutes
        );

        return deployer;
    };
};
