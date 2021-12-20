const truffleAssert = require('truffle-assertions');
const RooTroop = artifacts.require("RooTroop");
const Signer = artifacts.require("VerifySignature");

export {};

enum Mints {
  Presale = 1,
  Free = 0,
}

interface MintTransaction {
  minter: string;
  quantity: number;
  targetMint: Mints;
  nonce: number;
}

contract('RooTroop', (accounts) => {
  beforeEach(async () => {
    RooTroop.link("VerifySignature", (await Signer.new()).address)
  });

  it('sets free mint', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAddress, now, later, later, later, later, { from: accounts[0] });
    
    const { 1: startDate, 2: endDate } = await rooTroopInstance.freeMint();

    assert.equal(startDate.toNumber(), now, "Invalid startDate");
    assert.equal(endDate.toNumber(), later, "Invalid endDate");
  });

  it('sets presale mint', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAddress, later, later, now, later, later, { from: accounts[0] });
    const { 0: mintPrice, 1: startDate, 2: endDate } = await rooTroopInstance.presaleMint();

    assert.equal(startDate.toNumber(), now, "Invalid startDate");
    assert.equal(endDate.toNumber(), later, "Invalid endDate");
    assert.equal(mintPrice.toNumber(), 3, "Invalid presale price");
  });

  it('sets public mint', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 3, 3, signerAddress, later, later, later, later, now, { from: accounts[0] });
    const { 1: startDate, 0: mintPrice, 2: maxPerWallet } = await rooTroopInstance.publicMint();

    assert.equal(startDate.toNumber(), now, "Invalid startDate");
    assert.equal(mintPrice.toNumber(), 3, "Invalid presale price");
    assert.equal(maxPerWallet.toNumber(), 3, "Invalid max per wallet");
  });

  it('sets baseURI', async () => {
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);
    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAddress, later, later, later, later, later, { from: accounts[0] });

    await rooTroopInstance.setBaseURI("Test/");
    await rooTroopInstance.mint(1);
    const uri = await rooTroopInstance.tokenURI(1);
    assert.equal(uri, "Test/1", "Invalid URI");

    await truffleAssert.reverts(
      rooTroopInstance.tokenURI(2)
    );
  });

  it('updates free mint', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAddress, later, later, later, later, later, { from: accounts[0] });
    let { 1: startDate, 2: endDate } = await rooTroopInstance.freeMint();

    assert.equal(startDate.toNumber(), later, "Invalid startDate");
    assert.equal(endDate.toNumber(), later, "Invalid endDate");

    await rooTroopInstance.updateFreeMint(now, later + 2, 250);
    ({ 1: startDate, 2: endDate } = await rooTroopInstance.freeMint());

    assert.equal(startDate.toNumber(), now, "Invalid startDate");
    assert.equal(endDate.toNumber(), later + 2, "Invalid endDate");
  });

  it('updates presale mint', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAddress, later, later, later, later, later, { from: accounts[0] });
    let { 0: mintPrice, 1: startDate, 2: endDate } = await rooTroopInstance.presaleMint();

    assert.equal(startDate.toNumber(), later, "Invalid startDate");
    assert.equal(endDate.toNumber(), later, "Invalid endDate");
    assert.equal(mintPrice.toNumber(), 3, "Invalid presale price");

    await rooTroopInstance.updatePresaleMint(2, now, later + 2, 1000);
    ({ 0: mintPrice, 1: startDate, 2: endDate } = await rooTroopInstance.presaleMint());

    assert.equal(startDate.toNumber(), now, "Invalid startDate");
    assert.equal(endDate.toNumber(), later + 2, "Invalid endDate");
    assert.equal(mintPrice.toNumber(), 2, "Invalid presale price");
  });

  it('updates public mint', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAddress, later, later, later, later, later, { from: accounts[0] });
    let { 1: startDate, 0: mintPrice, 2: maxPerWallet } = await rooTroopInstance.publicMint();

    assert.equal(startDate.toNumber(), later, "Invalid startDate");
    assert.equal(mintPrice.toNumber(), 3, "Invalid public sale price");
    assert.equal(maxPerWallet.toNumber(), 10, "Invalid public sale max");

    await rooTroopInstance.updatePublicMint(2, 2, now);
    ({ 1: startDate, 0: mintPrice, 2: maxPerWallet } = await rooTroopInstance.publicMint());

    assert.equal(startDate.toNumber(), now, "Invalid startDate");
    assert.equal(mintPrice.toNumber(), 2, "Invalid public sale price");
    assert.equal(maxPerWallet.toNumber(), 2, "Invalid public sale max");
  });

  it('sets the owner', async () => {
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAddress, later, later, later, later, later, { from: accounts[0] });

    assert.equal(await rooTroopInstance.owner(), accounts[0], "Invalid contract owner");
    await rooTroopInstance.transferOwnership(accounts[1]);
        
    assert.equal(await rooTroopInstance.owner(), accounts[1], "Invalid new contract owner");
  });

  it('mints publically', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 3, 3, signerAddress, later, later, later, later, now, { from: accounts[0] });
    await rooTroopInstance.mint(3, { value: '9', from: accounts[1] });

    const newBalance = await (await rooTroopInstance.balanceOf(accounts[1])).toNumber();

    assert.equal(newBalance, 3, "Failure to mint 3");

    const { 1: startDate, 0: mintPrice, 2: maxPerWallet } = await rooTroopInstance.publicMint();

    assert.equal(startDate.toNumber(), now, "Invalid start date");
    assert.equal(mintPrice.toNumber(), 3, "Invalid mint price");
    assert.equal(maxPerWallet.toNumber(), 3, "Invalid max per wallet");
  });

  it('cannot mint more than transaction maximum', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 3, 3, signerAddress, later, later, later, later, now, { from: accounts[0] });
    await truffleAssert.reverts(
      rooTroopInstance.mint(6, { value: '18', from: accounts[1] })
    );
  })

  it('cannot mint more than supply', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5, 250, 1000, 10, 3, signerAddress, later, later, later, later, now, { from: accounts[0] });
    await truffleAssert.reverts(
      rooTroopInstance.mint(6, { value: '18', from: accounts[1] })
    );
  });

  it('mints free', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAccount.address, now, later, later, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
      targetMint: Mints.Free,
    };

    const hash = await rooTroopInstance.getPremintHash(trans.minter, trans.quantity, trans.targetMint, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await rooTroopInstance.premint(trans.quantity, trans.targetMint, trans.nonce, signature, { from: accounts[1] });
    assert.equal((await rooTroopInstance.balanceOf(accounts[1])).toNumber(), trans.quantity, "Mint failed");
    assert.equal((await rooTroopInstance.getWhitelistMints(accounts[1]))[Mints.Free].toNumber(), 3);
  });

  it('cannot mint more free than limit', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();

    // limit 3
    const rooTroopInstance = await RooTroop.new(5500, 3, 1000, 10, 3, signerAccount.address, now, later, later, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 4,
      nonce: 1,
      targetMint: Mints.Free,
    };

    const hash = await rooTroopInstance.getPremintHash(trans.minter, trans.quantity, trans.targetMint, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await truffleAssert.reverts(
      rooTroopInstance.premint(trans.quantity, trans.targetMint, trans.nonce, signature, { from: accounts[1] })
    );
  });

  it('mints presale', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAccount.address, later, later, now, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
      targetMint: Mints.Presale,
    };

    const hash = await rooTroopInstance.getPremintHash(trans.minter, trans.quantity, trans.targetMint, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await rooTroopInstance.premint(trans.quantity, trans.targetMint, trans.nonce, signature, { from: accounts[1], value: '9' });
    assert.equal((await rooTroopInstance.balanceOf(accounts[1])).toNumber(), trans.quantity, "Mint failed");
    assert.equal((await rooTroopInstance.getWhitelistMints(accounts[1]))[Mints.Presale].toNumber(), 3);
  });

  it('cannot mint more presale than limit', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();

    // limit 3
    const rooTroopInstance = await RooTroop.new(5500, 1000, 3, 10, 3, signerAccount.address, now, later, later, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 4,
      nonce: 1,
      targetMint: Mints.Presale,
    };

    const hash = await rooTroopInstance.getPremintHash(trans.minter, trans.quantity, trans.targetMint, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await truffleAssert.reverts(
      rooTroopInstance.premint(trans.quantity, trans.targetMint, trans.nonce, signature, { from: accounts[1] })
    );
  });

  it('cannot reuse signed transaction/change nonce', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAccount.address, now, later, later, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
      targetMint: Mints.Free,
    };

    const hash = await rooTroopInstance.getPremintHash(trans.minter, trans.quantity, trans.targetMint, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await rooTroopInstance.premint(trans.quantity, trans.targetMint, trans.nonce, signature, { from: accounts[1] });
    assert.equal((await rooTroopInstance.balanceOf(accounts[1])).toNumber(), trans.quantity, "Mint failed");

    await truffleAssert.reverts(
      rooTroopInstance.premint(trans.quantity, trans.targetMint, trans.nonce, signature, { from: accounts[1] })
    );

    await truffleAssert.reverts(
      rooTroopInstance.premint(trans.quantity, trans.targetMint, trans.nonce + 1, signature, { from: accounts[1] })
    );
  });

  it('cannot mint when not active', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAccount.address, later, later, later, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
      targetMint: Mints.Free,
    };

    const hash = await rooTroopInstance.getPremintHash(trans.minter, trans.quantity, trans.targetMint, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await truffleAssert.reverts(
      rooTroopInstance.premint(trans.quantity, trans.targetMint, trans.nonce, signature, { from: accounts[1] })
    );
  });

  it('cannot mint with a changed quantity', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAccount.address, now, later, later, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
      targetMint: Mints.Free,
    };

    const hash = await rooTroopInstance.getPremintHash(trans.minter, trans.quantity, trans.targetMint, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await truffleAssert.reverts(
      rooTroopInstance.premint(trans.quantity + 2, trans.targetMint, trans.nonce, signature, { from: accounts[1] })
    );
  });

  it('cannot mint with a changed address', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAccount.address, now, later, later, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
      targetMint: Mints.Free,
    };

    const hash = await rooTroopInstance.getPremintHash(trans.minter, trans.quantity, trans.targetMint, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await truffleAssert.reverts(
      rooTroopInstance.premint(trans.quantity, trans.targetMint, trans.nonce, signature, { from: accounts[2] })
    );
  });

  it('cannot mint when no mints active', async () => {
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAddress, later, later, later, later, later, { from: accounts[0] });
        
    await truffleAssert.reverts(
      rooTroopInstance.mint(3, { value: '9', from: accounts[1] }) // PUBLIC MINT
    );
  });

  it('can retrieve the latest nonce for a user', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAccount.address, later, later, now, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
      targetMint: Mints.Presale,
    };

    const hash = await rooTroopInstance.getPremintHash(trans.minter, trans.quantity, trans.targetMint, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await rooTroopInstance.premint(trans.quantity, trans.targetMint, trans.nonce, signature, { from: accounts[1], value: '9' });
    assert.equal((await rooTroopInstance.balanceOf(accounts[1])).toNumber(), trans.quantity, "Mint failed");

    const latestNonce = await rooTroopInstance.lastMintNonce(accounts[1]);
    assert.equal(latestNonce.toNumber(), trans.nonce);
  });

  it('can retrieve the number minted by a user', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const signerAccount = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAccount.address, later, later, now, later, now, { from: accounts[0] });

    const trans: MintTransaction = {
      minter: accounts[1],
      quantity: 3,
      nonce: 1,
      targetMint: Mints.Presale,
    };

    const hash = await rooTroopInstance.getPremintHash(trans.minter, trans.quantity, trans.targetMint, trans.nonce);
    const { signature } = signerAccount.sign(hash);

    await rooTroopInstance.premint(trans.quantity, trans.targetMint, trans.nonce, signature, { from: accounts[1], value: '9' });
    assert.equal((await rooTroopInstance.balanceOf(accounts[1])).toNumber(), trans.quantity, "Mint failed");
    
    const transferEvents = await rooTroopInstance.getPastEvents('Transfer');
    const mintEvents = transferEvents.filter(e => e.returnValues.from == '0x0000000000000000000000000000000000000000' && e.returnValues.to === accounts[1]);

    const numMinted = mintEvents.length;
    assert.equal(numMinted, trans.quantity);
  });

  it('withdraws', async () => {
    const now = Math.floor(new Date().valueOf() / 1000);
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { privateKey: signerPrivate, address: signerAddress } = web3.eth.accounts.create();
    const rooTroopInstance = await RooTroop.new(5500, 250, 1000, 10, 3, signerAddress, later, later, later, later, now, { from: accounts[0] }); // public

    await rooTroopInstance.mint(5, { value: '15', from: accounts[1] });
    const balance = await web3.eth.getBalance(rooTroopInstance.address);

    assert.equal(Number(balance), 15);

    await truffleAssert.reverts(
      rooTroopInstance.withdraw(15, { from: accounts[1] }) // invalid owner
    );

    await rooTroopInstance.withdraw(15, { from: accounts[0] });

    assert.equal(Number(await web3.eth.getBalance(rooTroopInstance.address)), 0);
  });
});
