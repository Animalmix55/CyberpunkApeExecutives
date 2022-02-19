module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
    const JoeyContract = artifacts.require('Joey');
    const Roolah = artifacts.require('MockERC20');

    return async (deployer: Truffle.Deployer) => {
        return deployer.deploy(
            JoeyContract,
            5500,
            (await Roolah.deployed()).address,
            '10000000000000000000', // 10 ROOLAH
            60 * 10, // 10 minutes
            'http://localhost/joey.php?tokenId='
        );
    };
};
