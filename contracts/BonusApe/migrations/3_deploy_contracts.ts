module.exports = (artifacts: Truffle.Artifacts) => {
    const LegendsContract = artifacts.require('CyberpunkApeLegends');
    const CREDIT = artifacts.require('MockERC20');

    return async (deployer: Truffle.Deployer) => {
        return deployer.deploy(
            LegendsContract,
            5500,
            (await CREDIT.deployed()).address,
            '10000000000000000000', // 10 ROOLAH
            'http://localhost/joey.php?tokenId='
        );
    };
};
