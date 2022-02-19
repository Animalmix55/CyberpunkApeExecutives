module.exports = (artifacts: Truffle.Artifacts) => {
    const Roolah = artifacts.require('MockERC20');

    return async (deployer: Truffle.Deployer) => {
        deployer.deploy(Roolah, 'Roolah', 'RL');
    };
};
