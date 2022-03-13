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
    BadId = 'Bad id',
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

        assert.equal(
            await CyberpunkApeLegendsInstance.tokenURI(1),
            'baseURI/1'
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

        assert.equal(await CyberpunkApeLegendsInstance.ownerOf(1), accounts[0]);
    });

    it('allows owners to mint for free', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            5500,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        await CyberpunkApeLegendsInstance.mint(2, { from: accounts[0] }); // mint 1 for URI access
        assert.equal(
            (
                await CyberpunkApeLegendsInstance.balanceOf(accounts[0])
            ).toNumber(),
            2
        );
    });

    it('allows owners to bulk mint for free', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            5500,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        await CyberpunkApeLegendsInstance.mintMany([2, 3, 4, 5], {
            from: accounts[0],
        }); // mint 1 for URI access
        assert.equal(
            (
                await CyberpunkApeLegendsInstance.balanceOf(accounts[0])
            ).toNumber(),
            5
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
            CyberpunkApeLegendsInstance.mint(2, { from: accounts[1] }) // mint 1 to fail
        );
    });

    it('does not allow non-owners to bulk mint for free', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            5500,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.mintMany([2], { from: accounts[1] }) // mint 1 to fail
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
        await CyberpunkApeLegendsInstance.mint(3, { from: accounts[1] }); // mint 3
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

    it('allows payment in the ERC20 token to mint (with override)', async () => {
        const { CyberpunkApeLegendsInstance, PaymentTokenInstance } =
            await deploy(5500, 10000, 'baseURI/', {
                from: accounts[0],
            });

        // set 2 to 1000, 3 to 1500, 4 to 10000 (same as global cost)
        await CyberpunkApeLegendsInstance.setMintPriceOverrides(
            2,
            [1000, 1500, 10000]
        );

        await PaymentTokenInstance.mint(accounts[1], 2500);
        await PaymentTokenInstance.approve(
            CyberpunkApeLegendsInstance.address,
            2500,
            {
                from: accounts[1],
            }
        );

        await CyberpunkApeLegendsInstance.mint(2, { from: accounts[1] }); // mint 2
        await CyberpunkApeLegendsInstance.mint(3, { from: accounts[1] }); // mint 3
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
            2500
        );

        // update mint price, ensure not overridden
        await CyberpunkApeLegendsInstance.setMintPrice(1000);
        await PaymentTokenInstance.mint(accounts[1], 1000);
        await PaymentTokenInstance.approve(
            CyberpunkApeLegendsInstance.address,
            1000,
            {
                from: accounts[1],
            }
        );

        await CyberpunkApeLegendsInstance.mint(4, { from: accounts[1] }); // mint 4
        assert.equal(
            (
                await CyberpunkApeLegendsInstance.balanceOf(accounts[1])
            ).toNumber(),
            3
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
            3500
        );
    });

    it('allows payment in the ERC20 token to bulk mint', async () => {
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

        await CyberpunkApeLegendsInstance.mintMany([2, 3], {
            from: accounts[1],
        }); // mint 2 and 3
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

    it('allows payment in the ERC20 token to bulk mint (with overrides)', async () => {
        const { CyberpunkApeLegendsInstance, PaymentTokenInstance } =
            await deploy(5500, 10000, 'baseURI/', {
                from: accounts[0],
            });

        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.setMintPriceOverrides(
                2,
                [1000, 1500, 10000],
                {
                    from: accounts[1],
                }
            ) // bad owner
        );

        // set 2 to 1000, 3 to 1500, 4 to 10000 (same as global cost)
        await CyberpunkApeLegendsInstance.setMintPriceOverrides(
            2,
            [1000, 1500, 10000]
        );
        await PaymentTokenInstance.mint(accounts[1], 2500);
        await PaymentTokenInstance.approve(
            CyberpunkApeLegendsInstance.address,
            2500,
            {
                from: accounts[1],
            }
        );

        await CyberpunkApeLegendsInstance.mintMany([2, 3], {
            from: accounts[1],
        }); // mint 2 and 3
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
            2500
        );

        // update mint cost, make sure #4 updates
        await CyberpunkApeLegendsInstance.setMintPrice(1000);
        await PaymentTokenInstance.mint(accounts[1], 1000);
        await PaymentTokenInstance.approve(
            CyberpunkApeLegendsInstance.address,
            1000,
            {
                from: accounts[1],
            }
        );

        await CyberpunkApeLegendsInstance.mintMany([4], {
            from: accounts[1],
        }); // mint 4

        assert.equal(
            (
                await CyberpunkApeLegendsInstance.balanceOf(accounts[1])
            ).toNumber(),
            3
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
            3500
        );
    });

    it('gives tokens the token URI', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            5500,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        assert(await CyberpunkApeLegendsInstance.tokenURI(1), 'baseURI/1');
    });

    it('does not allow minting (bulk or otherwise) outside of supply', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            3,
            10000,
            'baseURI/',
            { from: accounts[0] }
        );

        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.mint(0, { from: accounts[0] }), // mint <= 0 fails
            ErrorMessages.BadId
        );

        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.mint(4, { from: accounts[0] }), // mint > 3 fails
            ErrorMessages.BadId
        );

        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.mintMany([0], { from: accounts[0] }), // mint <= 0 fails
            ErrorMessages.BadId
        );

        await truffleAssert.reverts(
            CyberpunkApeLegendsInstance.mintMany([4], { from: accounts[0] }), // mint > 3 fails
            ErrorMessages.BadId
        );

        await CyberpunkApeLegendsInstance.mint(2, { from: accounts[0] });
        await CyberpunkApeLegendsInstance.mintMany([3], { from: accounts[0] });
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
        await CyberpunkApeLegendsInstance.mint(3, { from: accounts[1] }); // mint 3

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
            await CyberpunkApeLegendsInstance.tokenURI(1),
            'baseURI/1'
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
            await CyberpunkApeLegendsInstance.tokenURI(1),
            'newbaseURI/1'
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

    it('allows fetching unminted tokens', async () => {
        const { CyberpunkApeLegendsInstance } = await deploy(
            20,
            10000,
            'baseURI/',
            {
                from: accounts[0],
            }
        );

        let unminted = (await CyberpunkApeLegendsInstance.unmintedTokens()).map(
            (f) => f.toNumber()
        );
        assert.lengthOf(unminted, 19); // 1 minted on deployment

        assert.deepEqual(
            unminted,
            Array.from(new Array(19)).map((_, i) => i + 2)
        );

        await CyberpunkApeLegendsInstance.mint(15);

        unminted = (await CyberpunkApeLegendsInstance.unmintedTokens()).map(
            (f) => f.toNumber()
        );
        assert.lengthOf(unminted, 18); // 1 and 15 minted

        assert.deepEqual(
            unminted,
            Array.from(new Array(19))
                .map((_, i) => i + 2)
                .filter((v) => v !== 15)
        );
    });
});
