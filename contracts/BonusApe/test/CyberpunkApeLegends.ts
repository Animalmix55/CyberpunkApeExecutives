/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const truffleAssert = require('truffle-assertions');

const CyberpunkApeLegends = artifacts.require('CyberpunkApeLegends');
const TestToken = artifacts.require('MockERC20');

export {};

enum ErrorMessages {
    BadMax = 'Bad max',
    BadToken = 'Bad token',
    BadCost = 'Bad cost',
    MintOver = 'Mint over',
    BadQuantity = 'Bad quantity',
    NotEnough = 'Not enough',
    NotOwner = 'Not owner',
    NotAdmin = 'Ownable: caller is not the owner',
    TooSmall = 'Too small',
}

const deploy = async (
    _supply: string | number | BN,
    _mintCost: string | number | BN,
    _baseURI: string,
    meta?: Truffle.TransactionDetails
) => {
    const PaymentTokenInstance = await TestToken.new('Test', 'T', meta || {});
    const CyberpunkApeLegendsInstance = await CyberpunkApeLegends.new(
        _supply,
        PaymentTokenInstance.address,
        _mintCost,
        _baseURI,
        meta || {}
    );

    return { CyberpunkApeLegendsInstance, PaymentTokenInstance };
};

contract('CyberpunkApeLegends', (accounts) => {
    it('deploys and sets contract values', async () => {
        const { CyberpunkApeLegendsInstance, PaymentTokenInstance } =
            await deploy(5500, 10000, 'baseURI/', { from: accounts[0] });

        await CyberpunkApeLegendsInstance.mint(1); // mint 1 for URI access

        assert.equal(
            await CyberpunkApeLegendsInstance.tokenURI(0),
            'baseURI/0'
        );

        assert.equal(
            await CyberpunkApeLegendsInstance.paymentToken(),
            PaymentTokenInstance.address
        );
        assert.equal(
            (await CyberpunkApeLegendsInstance.mintCost()).toNumber(),
            10000
        );
    });

    it('mints a token on deployment', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            5500,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        assert.equal(await CyberpunkApeLegendsInstance.ownerOf(0), accounts[0]);
    });

    it('allows owners to mint for free', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            5500,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        await CyberpunkApeLegendsInstance.mint(1, { from: accounts[0] }); // mint 1 for URI access
        assert.equal(
            (
                await CyberpunkApeLegendsInstance.balanceOf(accounts[0])
            ).toNumber(),
            2
        );
    });

    it('does not allow non-owners to mint for free', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            5500,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.mint(1, { from: accounts[1] }) // mint 1 to fail
        );
    });

    it('allows payment in the ERC20 token to mint', async () => {
        const { CyberpunkApeLegendsInstance, PaymentTokenInstance } =
            await deploy(5500, 10000, 'baseURI/', {
                from: accounts[0],
            });

        await PaymentTokenInstance.mint(accounts[1], 20000);
        await PaymentTokenInstance.approve(
            CyberpunkApeLegendsInstance.address,
            20000,
            {
                from: accounts[1],
            }
        );

        await CyberpunkApeLegendsInstance.mint(2, { from: accounts[1] }); // mint 2
        assert.equal(
            (
                await CyberpunkApeLegendsInstance.balanceOf(accounts[1])
            ).toNumber(),
            2
        );
        assert.equal(
            (await PaymentTokenInstance.balanceOf(accounts[1])).toNumber(),
            0
        );
        assert.equal(
            (
                await PaymentTokenInstance.balanceOf(
                    CyberpunkApeLegendsInstance.address
                )
            ).toNumber(),
            20000
        );
    });

    it('gives tokens the token URI', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            5500,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        assert(await CyberpunkApeLegendsInstance.tokenURI(0), 'baseURI/0');
    });

    it('does not allow minting more than supply', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            3,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.mint(3, { from: accounts[0] }), // mint >2 to fail
            ErrorMessages.NotEnough
        );

        await CyberpunkApeLegendsInstance.mint(2, { from: accounts[0] });
        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.mint(1, { from: accounts[0] }), // mint 1 more to fail
            ErrorMessages.MintOver
        );
    });

    it('allows withdrawing of ERC20 token', async () => {
        const { CyberpunkApeLegendsInstance, PaymentTokenInstance } =
            await deploy(5500, 10000, 'baseURI/', {
                from: accounts[0],
            });

        await PaymentTokenInstance.mint(accounts[1], 20000);
        await PaymentTokenInstance.approve(
            CyberpunkApeLegendsInstance.address,
            20000,
            {
                from: accounts[1],
            }
        );

        await CyberpunkApeLegendsInstance.mint(2, { from: accounts[1] }); // mint 2

        assert.equal(
            (
                await PaymentTokenInstance.balanceOf(
                    CyberpunkApeLegendsInstance.address
                )
            ).toNumber(),
            20000
        );

        // reverts when not owner
        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.withdraw(20000, { from: accounts[1] }),
            ErrorMessages.NotAdmin
        );

        await CyberpunkApeLegendsInstance.withdraw(20000, {
            from: accounts[0],
        });
        assert.equal(
            (
                await PaymentTokenInstance.balanceOf(
                    CyberpunkApeLegendsInstance.address
                )
            ).toNumber(),
            0
        );
        assert.equal(
            (await PaymentTokenInstance.balanceOf(accounts[0])).toNumber(),
            20000
        );
    });

    it('can update base URI', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            5500,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        assert.equal(
            await CyberpunkApeLegendsInstance.tokenURI(0),
            'baseURI/0'
        );
        // reverts when not owner
        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.setBaseURI('newbaseURI/', {
                from: accounts[1],
            }),
            ErrorMessages.NotAdmin
        );
        await CyberpunkApeLegendsInstance.setBaseURI('newbaseURI/');
        assert.equal(
            await CyberpunkApeLegendsInstance.tokenURI(0),
            'newbaseURI/0'
        );
    });

    it('can update max supply', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            5500,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        assert.equal(
            (await CyberpunkApeLegendsInstance.maxSupply()).toString(),
            '5500'
        );

        // reverts when not owner
        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.setMaxSupply(100, {
                from: accounts[1],
            }),
            ErrorMessages.NotAdmin
        );

        // reverts when too small
        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.setMaxSupply(100, {
                from: accounts[1],
            }),
            ErrorMessages.NotAdmin
        );

        await CyberpunkApeLegendsInstance.setMaxSupply(5501);

        assert.equal(
            (await CyberpunkApeLegendsInstance.maxSupply()).toString(),
            '5501'
        );
    });

    it('can update the payment token address', async () => {
        const { CyberpunkApeLegendsInstance, PaymentTokenInstance } =
            await deploy(5500, 10000, 'baseURI/', {
                from: accounts[0],
            });

        assert.equal(
            await CyberpunkApeLegendsInstance.paymentToken(),
            PaymentTokenInstance.address
        );
        const NewPaymentTokenInstance = await TestToken.new('Test', 'T');
        // reverts when not owner
        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.setPaymentToken(
                NewPaymentTokenInstance.address,
                {
                    from: accounts[1],
                }
            ),
            ErrorMessages.NotAdmin
        );
        await CyberpunkApeLegendsInstance.setPaymentToken(
            NewPaymentTokenInstance.address
        );
        assert.equal(
            await CyberpunkApeLegendsInstance.paymentToken(),
            NewPaymentTokenInstance.address
        );
    });
});
