module.exports = (artifacts: Truffle.Artifacts) => {
    const LegendsContract = artifacts.require('CyberpunkApeLegends');
    const Staking = artifacts.require('IMDStaking');

    return async (deployer: Truffle.Deployer) => {
        const stakingInstance = await Staking.deployed();
        const creditAddress = await stakingInstance.rewardToken();

        return deployer.deploy(
            LegendsContract,
            100,
            creditAddress,
            '10000000000000000000', // 10 CREDIT
            'http://localhost/joey.php?tokenId='
        );
    };
};
