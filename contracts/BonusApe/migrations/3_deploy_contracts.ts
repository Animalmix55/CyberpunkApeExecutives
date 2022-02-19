module.exports = (artifacts: Truffle.Artifacts) => {
    const LegendsContract = artifacts.require('CyberpunkApeLegends');
    const CREDIT = artifacts.require('MockERC20');

    return async (deployer: Truffle.Deployer) => {
        return deployer.deploy(
            LegendsContract,
            100,
            (await CREDIT.deployed()).address,
            '10000000000000000000', // 10 CREDIT
            'http://localhost/joey.php?tokenId='
        );
    };
};
