/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type Approval = ContractEventLog<{
  owner: string;
  approved: string;
  tokenId: string;
  0: string;
  1: string;
  2: string;
}>;
export type ApprovalForAll = ContractEventLog<{
  owner: string;
  operator: string;
  approved: boolean;
  0: string;
  1: string;
  2: boolean;
}>;
export type OwnershipTransferred = ContractEventLog<{
  previousOwner: string;
  newOwner: string;
  0: string;
  1: string;
}>;
export type Transfer = ContractEventLog<{
  from: string;
  to: string;
  tokenId: string;
  0: string;
  1: string;
  2: string;
}>;

export interface CyberpunkApeLegends extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): CyberpunkApeLegends;
  clone(): CyberpunkApeLegends;
  methods: {
    /**
     * See {IERC721-approve}.
     */
    approve(
      to: string,
      tokenId: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * See {IERC721-balanceOf}.
     */
    balanceOf(owner: string): NonPayableTransactionObject<string>;

    /**
     * See {IERC721-getApproved}.
     */
    getApproved(
      tokenId: number | string | BN
    ): NonPayableTransactionObject<string>;

    /**
     * See {IERC721-isApprovedForAll}.
     */
    isApprovedForAll(
      owner: string,
      operator: string
    ): NonPayableTransactionObject<boolean>;

    /**
     * The maximum supply for the token. Will never exceed this supply.
     */
    maxSupply(): NonPayableTransactionObject<string>;

    /**
     * The cost of minting
     */
    mintCost(): NonPayableTransactionObject<string>;

    /**
     * See {IERC721Metadata-name}.
     */
    name(): NonPayableTransactionObject<string>;

    /**
     * Returns the address of the current owner.
     */
    owner(): NonPayableTransactionObject<string>;

    /**
     * See {IERC721-ownerOf}.
     */
    ownerOf(tokenId: number | string | BN): NonPayableTransactionObject<string>;

    /**
     * The ERC20 token contract that will be used to pay to mint the token.
     */
    paymentToken(): NonPayableTransactionObject<string>;

    /**
     * Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.
     */
    renounceOwnership(): NonPayableTransactionObject<void>;

    /**
     * See {IERC721-safeTransferFrom}.
     */
    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * See {IERC721-safeTransferFrom}.
     */
    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: number | string | BN,
      _data: string | number[]
    ): NonPayableTransactionObject<void>;

    /**
     * See {IERC721-setApprovalForAll}.
     */
    setApprovalForAll(
      operator: string,
      approved: boolean
    ): NonPayableTransactionObject<void>;

    /**
     * See {IERC165-supportsInterface}.
     */
    supportsInterface(
      interfaceId: string | number[]
    ): NonPayableTransactionObject<boolean>;

    /**
     * See {IERC721Metadata-symbol}.
     */
    symbol(): NonPayableTransactionObject<string>;

    /**
     * See {IERC721Enumerable-tokenByIndex}.
     */
    tokenByIndex(
      index: number | string | BN
    ): NonPayableTransactionObject<string>;

    /**
     * See {IERC721Enumerable-tokenOfOwnerByIndex}.
     */
    tokenOfOwnerByIndex(
      owner: string,
      index: number | string | BN
    ): NonPayableTransactionObject<string>;

    /**
     * See {IERC721Metadata-tokenURI}.
     */
    tokenURI(
      tokenId: number | string | BN
    ): NonPayableTransactionObject<string>;

    /**
     * See {IERC721Enumerable-totalSupply}.
     */
    totalSupply(): NonPayableTransactionObject<string>;

    /**
     * See {IERC721-transferFrom}.
     */
    transferFrom(
      from: string,
      to: string,
      tokenId: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
     */
    transferOwnership(newOwner: string): NonPayableTransactionObject<void>;

    /**
     * be sure to terminate with a slash
     * Sets the base URI for all immature tokens
     * @param uri - the target base uri (ex: 'https://google.com/')
     */
    setBaseURI(uri: string): NonPayableTransactionObject<void>;

    setMaxSupply(
      supply: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * Sets the payment ERC20 token
     * @param tokenAddress - the address of the payment token
     */
    setPaymentToken(tokenAddress: string): NonPayableTransactionObject<void>;

    /**
     * Sets the mint price
     * @param _mintCost - the mint cost
     */
    setMintPrice(
      _mintCost: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * Mints the given token id provided it is possible to. transfers the required number of payment tokens from the user's walletThis function allows minting for the set cost, or free for the contract owner
     * @param tokenId - the token id to mint
     */
    mint(tokenId: number | string | BN): NonPayableTransactionObject<void>;

    /**
     * Mints the given token ids provided it is possible to. transfers the required number of payment tokens from the user's walletThis function allows minting for the set cost, or free for the contract owner
     * @param tokenIds - the token ids to mint
     */
    mintMany(
      tokenIds: (number | string | BN)[]
    ): NonPayableTransactionObject<void>;

    /**
     * Burns the provided token id if you own it. Reduces the supply by 1.
     * @param tokenId - the ID of the token to be burned.
     */
    burn(tokenId: number | string | BN): NonPayableTransactionObject<void>;

    /**
     * Gets the balance of the contract in payment tokens.
     */
    balance(): NonPayableTransactionObject<string>;

    /**
     * Withdraws balance from the contract to the owner (sender).
     * @param amount - the amount to withdraw, much be <= contract balance.
     */
    withdraw(amount: number | string | BN): NonPayableTransactionObject<void>;

    unmintedTokens(): NonPayableTransactionObject<string[]>;
  };
  events: {
    Approval(cb?: Callback<Approval>): EventEmitter;
    Approval(options?: EventOptions, cb?: Callback<Approval>): EventEmitter;

    ApprovalForAll(cb?: Callback<ApprovalForAll>): EventEmitter;
    ApprovalForAll(
      options?: EventOptions,
      cb?: Callback<ApprovalForAll>
    ): EventEmitter;

    OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter;
    OwnershipTransferred(
      options?: EventOptions,
      cb?: Callback<OwnershipTransferred>
    ): EventEmitter;

    Transfer(cb?: Callback<Transfer>): EventEmitter;
    Transfer(options?: EventOptions, cb?: Callback<Transfer>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "Approval", cb: Callback<Approval>): void;
  once(event: "Approval", options: EventOptions, cb: Callback<Approval>): void;

  once(event: "ApprovalForAll", cb: Callback<ApprovalForAll>): void;
  once(
    event: "ApprovalForAll",
    options: EventOptions,
    cb: Callback<ApprovalForAll>
  ): void;

  once(event: "OwnershipTransferred", cb: Callback<OwnershipTransferred>): void;
  once(
    event: "OwnershipTransferred",
    options: EventOptions,
    cb: Callback<OwnershipTransferred>
  ): void;

  once(event: "Transfer", cb: Callback<Transfer>): void;
  once(event: "Transfer", options: EventOptions, cb: Callback<Transfer>): void;
}