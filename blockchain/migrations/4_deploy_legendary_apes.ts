module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
    const LegendsContract = artifacts.require('CyberpunkApeLegends');
    const Staking = artifacts.require('IMDStaking');

    return async (deployer: Truffle.Deployer) => {
        const stakingInstance = await Staking.deployed();
        const creditAddress = await stakingInstance.rewardToken();

        const accounts = await web3.eth.getAccounts();
        await stakingInstance.mintRewardToken(accounts[0], '10000000000000');
        await stakingInstance.mintRewardToken(accounts[1], '10000000000000');
        await stakingInstance.mintRewardToken(accounts[2], '10000000000000');

        return deployer.deploy(
            LegendsContract,
            100,
            creditAddress,
            '10000000000000000000', // 10 CREDIT
            'https://cc_nftstore.mypinata.cloud/ipfs/Qmby8DnCNmVc1siUAmxXzXYndYTXX4ewWt6ZSZThiLFZ4g/'
        );
    };
};
