/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface RooTroopContract extends Truffle.Contract<RooTroopInstance> {
  "new"(
    maxSupply: number | BN | string,
    maxFree: number | BN | string,
    maxPresale: number | BN | string,
    publicTransactionMax: number | BN | string,
    mintPrice: number | BN | string,
    signer: string,
    freeMintStart: number | BN | string,
    freeMintEnd: number | BN | string,
    presaleMintStart: number | BN | string,
    presaleMintEnd: number | BN | string,
    publicMintStart: number | BN | string,
    meta?: Truffle.TransactionDetails
  ): Promise<RooTroopInstance>;
}

export interface Approval {
  name: "Approval";
  args: {
    owner: string;
    approved: string;
    tokenId: BN;
    0: string;
    1: string;
    2: BN;
  };
}

export interface ApprovalForAll {
  name: "ApprovalForAll";
  args: {
    owner: string;
    operator: string;
    approved: boolean;
    0: string;
    1: string;
    2: boolean;
  };
}

export interface OwnershipTransferred {
  name: "OwnershipTransferred";
  args: {
    previousOwner: string;
    newOwner: string;
    0: string;
    1: string;
  };
}

export interface Paid {
  name: "Paid";
  args: {
    sender: string;
    amount: BN;
    0: string;
    1: BN;
  };
}

export interface Transfer {
  name: "Transfer";
  args: {
    from: string;
    to: string;
    tokenId: BN;
    0: string;
    1: string;
    2: BN;
  };
}

export interface Withdraw {
  name: "Withdraw";
  args: {
    recipient: string;
    amount: BN;
    0: string;
    1: BN;
  };
}

type AllEvents =
  | Approval
  | ApprovalForAll
  | OwnershipTransferred
  | Paid
  | Transfer
  | Withdraw;

export interface RooTroopInstance extends Truffle.ContractInstance {
  /**
   * See {IERC721-approve}.
   */
  approve: {
    (
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * See {IERC721-balanceOf}.
   */
  balanceOf(owner: string, txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * The free mint
   */
  freeMint(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: BN }>;

  /**
   * See {IERC721-getApproved}.
   */
  getApproved(
    tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * See {IERC721-isApprovedForAll}.
   */
  isApprovedForAll(
    owner: string,
    operator: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  lastMintNonce(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  minted(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * See {IERC721Metadata-name}.
   */
  name(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * Returns the address of the current owner.
   */
  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * See {IERC721-ownerOf}.
   */
  ownerOf(
    tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * An exclusive mint for members granted presale from influencers
   */
  presaleMint(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: BN }>;

  /**
   * The public mint for everybody.
   */
  publicMint(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN; 2: BN }>;

  /**
   * Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.
   */
  renounceOwnership: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  /**
   * See {IERC721-setApprovalForAll}.
   */
  setApprovalForAll: {
    (
      operator: string,
      approved: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      operator: string,
      approved: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      operator: string,
      approved: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      operator: string,
      approved: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * See {IERC165-supportsInterface}.
   */
  supportsInterface(
    interfaceId: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * See {IERC721Metadata-symbol}.
   */
  symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * See {IERC721Metadata-tokenURI}.
   */
  tokenURI(
    tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  totalSupply(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * See {IERC721-transferFrom}.
   */
  transferFrom: {
    (
      from: string,
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      from: string,
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      from: string,
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      from: string,
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
   */
  transferOwnership: {
    (newOwner: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * be sure to terminate with a slash
   * Sets the base URI for all tokens
   * @param uri - the target base uri (ex: 'https://google.com/')
   */
  setBaseURI: {
    (uri: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(uri: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(
      uri: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      uri: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Burns the provided token id if you own it. Reduces the supply by 1.
   * @param tokenId - the ID of the token to be burned.
   */
  burn: {
    (
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  getWhitelistMints(
    user: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN }>;

  /**
   * Updates the presale mint's characteristics
   * @param endDate - the end date for that mint in UNIX seconds
   * @param mintPrice - the cost for that mint in WEI
   * @param startDate - the start date for that mint in UNIX seconds
   */
  updatePresaleMint: {
    (
      mintPrice: number | BN | string,
      startDate: number | BN | string,
      endDate: number | BN | string,
      maxMinted: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      mintPrice: number | BN | string,
      startDate: number | BN | string,
      endDate: number | BN | string,
      maxMinted: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      mintPrice: number | BN | string,
      startDate: number | BN | string,
      endDate: number | BN | string,
      maxMinted: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      mintPrice: number | BN | string,
      startDate: number | BN | string,
      endDate: number | BN | string,
      maxMinted: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Updates the free mint's characteristics
   * @param endDate - the end date for that mint in UNIX seconds
   * @param startDate - the start date for that mint in UNIX seconds
   */
  updateFreeMint: {
    (
      startDate: number | BN | string,
      endDate: number | BN | string,
      maxMinted: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      startDate: number | BN | string,
      endDate: number | BN | string,
      maxMinted: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      startDate: number | BN | string,
      endDate: number | BN | string,
      maxMinted: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      startDate: number | BN | string,
      endDate: number | BN | string,
      maxMinted: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Updates the public mint's characteristics
   * @param maxPerTransaction - the maximum amount allowed in a wallet to mint in the public mint
   * @param mintPrice - the cost for that mint in WEI
   * @param startDate - the start date for that mint in UNIX seconds
   */
  updatePublicMint: {
    (
      mintPrice: number | BN | string,
      maxPerTransaction: number | BN | string,
      startDate: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      mintPrice: number | BN | string,
      maxPerTransaction: number | BN | string,
      startDate: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      mintPrice: number | BN | string,
      maxPerTransaction: number | BN | string,
      startDate: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      mintPrice: number | BN | string,
      maxPerTransaction: number | BN | string,
      startDate: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  getPremintHash(
    minter: string,
    quantity: number | BN | string,
    mintId: number | BN | string,
    nonce: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * Mints in the premint stage by using a signed transaction from a centralized whitelist. The message signer is expected to only sign messages when they fall within the whitelist specifications.
   * @param mintId - 0 for free mint, 1 for presale mint
   * @param nonce - a random nonce which indicates that a signed transaction hasn't already been used.
   * @param quantity - the number to mint
   * @param signature - the signature given by the centralized whitelist authority, signed by                    the account specified as mintSigner.
   */
  premint: {
    (
      quantity: number | BN | string,
      mintId: number | BN | string,
      nonce: number | BN | string,
      signature: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      quantity: number | BN | string,
      mintId: number | BN | string,
      nonce: number | BN | string,
      signature: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      quantity: number | BN | string,
      mintId: number | BN | string,
      nonce: number | BN | string,
      signature: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      quantity: number | BN | string,
      mintId: number | BN | string,
      nonce: number | BN | string,
      signature: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Mints the given quantity of tokens provided it is possible to.This function allows minting in the public sale         or at any time for the owner of the contract.
   * @param quantity - the number of tokens to mint
   */
  mint: {
    (
      quantity: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      quantity: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      quantity: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      quantity: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Withdraws balance from the contract to the owner (sender).
   * @param amount - the amount to withdraw, much be <= contract balance.
   */
  withdraw: {
    (
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  methods: {
    /**
     * See {IERC721-approve}.
     */
    approve: {
      (
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC721-balanceOf}.
     */
    balanceOf(
      owner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * The free mint
     */
    freeMint(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: BN }>;

    /**
     * See {IERC721-getApproved}.
     */
    getApproved(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * See {IERC721-isApprovedForAll}.
     */
    isApprovedForAll(
      owner: string,
      operator: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    lastMintNonce(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    minted(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * See {IERC721Metadata-name}.
     */
    name(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * Returns the address of the current owner.
     */
    owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * See {IERC721-ownerOf}.
     */
    ownerOf(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * An exclusive mint for members granted presale from influencers
     */
    presaleMint(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: BN }>;

    /**
     * The public mint for everybody.
     */
    publicMint(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN; 2: BN }>;

    /**
     * Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.
     */
    renounceOwnership: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    /**
     * See {IERC721-setApprovalForAll}.
     */
    setApprovalForAll: {
      (
        operator: string,
        approved: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        operator: string,
        approved: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        operator: string,
        approved: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        operator: string,
        approved: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC165-supportsInterface}.
     */
    supportsInterface(
      interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * See {IERC721Metadata-symbol}.
     */
    symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * See {IERC721Metadata-tokenURI}.
     */
    tokenURI(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    totalSupply(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * See {IERC721-transferFrom}.
     */
    transferFrom: {
      (
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
     */
    transferOwnership: {
      (newOwner: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * be sure to terminate with a slash
     * Sets the base URI for all tokens
     * @param uri - the target base uri (ex: 'https://google.com/')
     */
    setBaseURI: {
      (uri: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(uri: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(
        uri: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        uri: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Burns the provided token id if you own it. Reduces the supply by 1.
     * @param tokenId - the ID of the token to be burned.
     */
    burn: {
      (
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    getWhitelistMints(
      user: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN }>;

    /**
     * Updates the presale mint's characteristics
     * @param endDate - the end date for that mint in UNIX seconds
     * @param mintPrice - the cost for that mint in WEI
     * @param startDate - the start date for that mint in UNIX seconds
     */
    updatePresaleMint: {
      (
        mintPrice: number | BN | string,
        startDate: number | BN | string,
        endDate: number | BN | string,
        maxMinted: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        mintPrice: number | BN | string,
        startDate: number | BN | string,
        endDate: number | BN | string,
        maxMinted: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        mintPrice: number | BN | string,
        startDate: number | BN | string,
        endDate: number | BN | string,
        maxMinted: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        mintPrice: number | BN | string,
        startDate: number | BN | string,
        endDate: number | BN | string,
        maxMinted: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Updates the free mint's characteristics
     * @param endDate - the end date for that mint in UNIX seconds
     * @param startDate - the start date for that mint in UNIX seconds
     */
    updateFreeMint: {
      (
        startDate: number | BN | string,
        endDate: number | BN | string,
        maxMinted: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        startDate: number | BN | string,
        endDate: number | BN | string,
        maxMinted: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        startDate: number | BN | string,
        endDate: number | BN | string,
        maxMinted: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        startDate: number | BN | string,
        endDate: number | BN | string,
        maxMinted: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Updates the public mint's characteristics
     * @param maxPerTransaction - the maximum amount allowed in a wallet to mint in the public mint
     * @param mintPrice - the cost for that mint in WEI
     * @param startDate - the start date for that mint in UNIX seconds
     */
    updatePublicMint: {
      (
        mintPrice: number | BN | string,
        maxPerTransaction: number | BN | string,
        startDate: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        mintPrice: number | BN | string,
        maxPerTransaction: number | BN | string,
        startDate: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        mintPrice: number | BN | string,
        maxPerTransaction: number | BN | string,
        startDate: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        mintPrice: number | BN | string,
        maxPerTransaction: number | BN | string,
        startDate: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    getPremintHash(
      minter: string,
      quantity: number | BN | string,
      mintId: number | BN | string,
      nonce: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * Mints in the premint stage by using a signed transaction from a centralized whitelist. The message signer is expected to only sign messages when they fall within the whitelist specifications.
     * @param mintId - 0 for free mint, 1 for presale mint
     * @param nonce - a random nonce which indicates that a signed transaction hasn't already been used.
     * @param quantity - the number to mint
     * @param signature - the signature given by the centralized whitelist authority, signed by                    the account specified as mintSigner.
     */
    premint: {
      (
        quantity: number | BN | string,
        mintId: number | BN | string,
        nonce: number | BN | string,
        signature: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        quantity: number | BN | string,
        mintId: number | BN | string,
        nonce: number | BN | string,
        signature: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        quantity: number | BN | string,
        mintId: number | BN | string,
        nonce: number | BN | string,
        signature: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        quantity: number | BN | string,
        mintId: number | BN | string,
        nonce: number | BN | string,
        signature: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Mints the given quantity of tokens provided it is possible to.This function allows minting in the public sale         or at any time for the owner of the contract.
     * @param quantity - the number of tokens to mint
     */
    mint: {
      (
        quantity: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        quantity: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        quantity: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        quantity: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Withdraws balance from the contract to the owner (sender).
     * @param amount - the amount to withdraw, much be <= contract balance.
     */
    withdraw: {
      (
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC721-safeTransferFrom}.
     */
    "safeTransferFrom(address,address,uint256)": {
      (
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC721-safeTransferFrom}.
     */
    "safeTransferFrom(address,address,uint256,bytes)": {
      (
        from: string,
        to: string,
        tokenId: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        from: string,
        to: string,
        tokenId: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        from: string,
        to: string,
        tokenId: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        from: string,
        to: string,
        tokenId: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}