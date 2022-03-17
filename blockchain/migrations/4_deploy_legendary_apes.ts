module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
    const LegendsContract = artifacts.require('CyberpunkApeLegends');
    const Staking = artifacts.require('IMDStaking');

    return async (deployer: Truffle.Deployer) => {
        const stakingInstance = await Staking.deployed();
        const creditAddress = await stakingInstance.rewardToken();

        const accounts = await web3.eth.getAccounts();
        await stakingInstance.mintRewardToken(
            accounts[0],
            '300000000000000000000' // 300
        );
        await stakingInstance.mintRewardToken(
            accounts[1],
            '300000000000000000000'
        );
        await stakingInstance.mintRewardToken(
            accounts[2],
            '300000000000000000000'
        );

        return deployer.deploy(
            LegendsContract,
            26,
            creditAddress,
            '1500000000000000000000', // 1500 CREDIT
            'http://localhost/legends.php?tokenId='
        );
    };
};
