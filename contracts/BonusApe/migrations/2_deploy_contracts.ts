module.exports = (artifacts: Truffle.Artifacts) => {
    const CREDIT = artifacts.require('MockERC20');

    return async (deployer: Truffle.Deployer) => {
        deployer.deploy(CREDIT, 'College Credit', 'CREDIT');
    };
};
