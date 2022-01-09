const truffleAssert = require('truffle-assertions');
const CyberpunkApeExecutives = artifacts.require("CyberpunkApeExecutives");
const Signer = artifacts.require("VerifySignature");

export {};

interface MintTransaction {
  minter: string;
  quantity: number;
  nonce: number;
}

contract('CyberpunkApeExecutives', (accounts) => {
  beforeEach(async () => {
    CyberpunkApeExecutives.link("VerifySignature", (await Signer.new()).address)
  });

  it('sets presale mint', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAddress, now, later, later, { from: accounts[0] });
    const { 0: startDate, 1: endDate } = await cyberpunkApeExecutivesInstance.presaleMint();

    assert.equal(startDate.toNumber(), now, "Invalid startDate");
    assert.equal(endDate.toNumber(), later, "Invalid endDate");
  });

  it('sets public mint', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 3, 3, signerAddress, later, later, now, { from: accounts[0] });
    const { 0: startDate, 1: maxPerTransaction } = await cyberpunkApeExecutivesInstance.publicMint();

    assert.equal(startDate.toNumber(), now, "Invalid startDate");
    assert.equal(maxPerTransaction.toNumber(), 3, "Invalid max per wallet");
  });

  it('sets mint price', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 3, 3, signerAddress, later, later, now, { from: accounts[0] });
    const mintPrice = await cyberpunkApeExecutivesInstance.mintPrice();

    assert.equal(mintPrice.toNumber(), 3, "Invalid mint price");
  });

  it('sets baseURI', async () => {
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);
    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAddress, later, later, later, { from: accounts[0] });

    await cyberpunkApeExecutivesInstance.setBaseURI("Test/");
    await cyberpunkApeExecutivesInstance.mint(1);
    const uri = await cyberpunkApeExecutivesInstance.tokenURI(1);
    assert.equal(uri, "Test/1", "Invalid URI");

    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.tokenURI(2)
    );
  });

  it('updates presale mint', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAddress, later, later, later, { from: accounts[0] });
    let { 0: startDate, 1: endDate } = await cyberpunkApeExecutivesInstance.presaleMint();

    assert.equal(startDate.toNumber(), later, "Invalid startDate");
    assert.equal(endDate.toNumber(), later, "Invalid endDate");

    await cyberpunkApeExecutivesInstance.updatePresaleMint(now, later + 2, 1000);
    ({ 0: startDate, 1: endDate } = await cyberpunkApeExecutivesInstance.presaleMint());

    assert.equal(startDate.toNumber(), now, "Invalid startDate");
    assert.equal(endDate.toNumber(), later + 2, "Invalid endDate");
  });

  it('updates public mint', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAddress, later, later, later, { from: accounts[0] });
    let { 0: startDate, 1: maxPerTransaction } = await cyberpunkApeExecutivesInstance.publicMint();

    assert.equal(startDate.toNumber(), later, "Invalid startDate");
    assert.equal(maxPerTransaction.toNumber(), 10, "Invalid public sale max");

    await cyberpunkApeExecutivesInstance.updatePublicMint(2, now);
    ({ 0: startDate, 1: maxPerTransaction } = await cyberpunkApeExecutivesInstance.publicMint());

    assert.equal(startDate.toNumber(), now, "Invalid startDate");
    assert.equal(maxPerTransaction.toNumber(), 2, "Invalid public sale max");
  });

  it('sets the owner', async () => {
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAddress, later, later, later, { from: accounts[0] });

    assert.equal(await cyberpunkApeExecutivesInstance.owner(), accounts[0], "Invalid contract owner");
    await cyberpunkApeExecutivesInstance.transferOwnership(accounts[1]);
        
    assert.equal(await cyberpunkApeExecutivesInstance.owner(), accounts[1], "Invalid new contract owner");
  });

  it('mints publically', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 3, 3, signerAddress, later, later, now, { from: accounts[0] });
    await cyberpunkApeExecutivesInstance.mint(3, { value: '9', from: accounts[1] });

    const newBalance = await (await cyberpunkApeExecutivesInstance.balanceOf(accounts[1])).toNumber();

    assert.equal(newBalance, 3, "Failure to mint 3");

    const { 0: startDate, 1: maxPerTransaction } = await cyberpunkApeExecutivesInstance.publicMint();

    assert.equal(startDate.toNumber(), now, "Invalid start date");
    assert.equal(maxPerTransaction.toNumber(), 3, "Invalid max per wallet");
  });

  it('cannot mint more than transaction maximum', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 3, 3, signerAddress, later, later, now, { from: accounts[0] });
    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.mint(6, { value: '18', from: accounts[1] })
    );
  })

  it('cannot mint more than supply', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5, 1000, 10, 3, signerAddress, later, later, now, { from: accounts[0] });
    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.mint(6, { value: '18', from: accounts[1] })
    );
  });

  it('mints presale', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAccount.address, now, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
    };

    const hash = await cyberpunkApeExecutivesInstance.getPremintHash(trans.minter, trans.quantity, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await cyberpunkApeExecutivesInstance.premint(trans.quantity, trans.nonce, signature, { from: accounts[1], value: '9' });
    assert.equal((await cyberpunkApeExecutivesInstance.balanceOf(accounts[1])).toNumber(), trans.quantity, "Mint failed");
    assert.equal((await cyberpunkApeExecutivesInstance.getPresaleMints(accounts[1])).toNumber(), 3);
  });

  it('mints presale with new signer', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount1 = web3.eth.accounts.create();
    const signerAccount2 = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAccount1.address, now, later, now, { from: accounts[0] });

    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.setSigner(signerAccount2.address, { from: accounts[1] }) // wrong user
    )
    await cyberpunkApeExecutivesInstance.setSigner(signerAccount2.address);

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
    };

    const hash = await cyberpunkApeExecutivesInstance.getPremintHash(trans.minter, trans.quantity, trans.nonce);
    const { signature } = signerAccount2.sign(hash);

    await cyberpunkApeExecutivesInstance.premint(trans.quantity, trans.nonce, signature, { from: accounts[1], value: '9' });
    assert.equal((await cyberpunkApeExecutivesInstance.balanceOf(accounts[1])).toNumber(), trans.quantity, "Mint failed");
    assert.equal((await cyberpunkApeExecutivesInstance.getPresaleMints(accounts[1])).toNumber(), 3);
  });

  it('cannot mint more presale than limit', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();

    // limit 3
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAccount.address, now, later, later, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 4,
      nonce: 1,
    };

    const hash = await cyberpunkApeExecutivesInstance.getPremintHash(trans.minter, trans.quantity, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.premint(trans.quantity, trans.nonce, signature, { from: accounts[1] })
    );
  });

  it('cannot reuse signed transaction/change nonce', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAccount.address, now, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
    };

    const hash = await cyberpunkApeExecutivesInstance.getPremintHash(trans.minter, trans.quantity, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await cyberpunkApeExecutivesInstance.premint(trans.quantity, trans.nonce, signature, { from: accounts[1], value: '9' });
    assert.equal((await cyberpunkApeExecutivesInstance.balanceOf(accounts[1])).toNumber(), trans.quantity, "Mint failed");

    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.premint(trans.quantity, trans.nonce, signature, { from: accounts[1] })
    );

    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.premint(trans.quantity, trans.nonce + 1, signature, { from: accounts[1] })
    );
  });

  it('cannot mint when not active', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAccount.address, later, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
    };

    const hash = await cyberpunkApeExecutivesInstance.getPremintHash(trans.minter, trans.quantity, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.premint(trans.quantity, trans.nonce, signature, { from: accounts[1] })
    );
  });

  it('cannot mint with a changed quantity', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAccount.address, now, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
    };

    const hash = await cyberpunkApeExecutivesInstance.getPremintHash(trans.minter, trans.quantity, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.premint(trans.quantity + 2, trans.nonce, signature, { from: accounts[1] })
    );
  });

  it('cannot mint with a changed address', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAccount.address, now, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
    };

    const hash = await cyberpunkApeExecutivesInstance.getPremintHash(trans.minter, trans.quantity, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.premint(trans.quantity, trans.nonce, signature, { from: accounts[2] })
    );
  });

  it('cannot mint when no mints active', async () => {
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAddress, later, later, later, { from: accounts[0] });
        
    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.mint(3, { value: '9', from: accounts[1] }) // PUBLIC MINT
    );
  });

  it('can retrieve the latest nonce for a user', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAccount.address, now, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
    };

    const hash = await cyberpunkApeExecutivesInstance.getPremintHash(trans.minter, trans.quantity, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await cyberpunkApeExecutivesInstance.premint(trans.quantity, trans.nonce, signature, { from: accounts[1], value: '9' });
    assert.equal((await cyberpunkApeExecutivesInstance.balanceOf(accounts[1])).toNumber(), trans.quantity, "Mint failed");

    const latestNonce = await cyberpunkApeExecutivesInstance.lastMintNonce(accounts[1]);
    assert.equal(latestNonce.toNumber(), trans.nonce);
  });

  it('can retrieve the number minted by a user', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAccount.address, now, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
    };

    const hash = await cyberpunkApeExecutivesInstance.getPremintHash(trans.minter, trans.quantity, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await cyberpunkApeExecutivesInstance.premint(trans.quantity, trans.nonce, signature, { from: accounts[1], value: '9' });
    assert.equal((await cyberpunkApeExecutivesInstance.balanceOf(accounts[1])).toNumber(), trans.quantity, "Mint failed");
    
    const transferEvents = await cyberpunkApeExecutivesInstance.getPastEvents('Transfer');
    const mintEvents = transferEvents.filter(e => e.returnValues.from == '0x0000000000000000000000000000000000000000' && e.returnValues.to === accounts[1]);

    const numMinted = mintEvents.length;
    assert.equal(numMinted, trans.quantity);
  });

  it('withdraws', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const cyberpunkApeExecutivesInstance = await CyberpunkApeExecutives.new(5500, 1000, 10, 3, signerAddress, later, later, now, { from: accounts[0] }); // public

    await cyberpunkApeExecutivesInstance.mint(5, { value: '15', from: accounts[1] });
    const balance = await web3.eth.getBalance(cyberpunkApeExecutivesInstance.address);

    assert.equal(Number(balance), 15);

    await truffleAssert.fails(
      cyberpunkApeExecutivesInstance.withdraw(15, { from: accounts[1] }) // invalid owner
    );

    await cyberpunkApeExecutivesInstance.withdraw(15, { from: accounts[0] });

    assert.equal(Number(await web3.eth.getBalance(cyberpunkApeExecutivesInstance.address)), 0);
  });
});
