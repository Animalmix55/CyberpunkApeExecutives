/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface VerifySignatureContract
  extends Truffle.Contract<VerifySignatureInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<VerifySignatureInstance>;
}

type AllEvents = never;

export interface VerifySignatureInstance extends Truffle.ContractInstance {
  getMessageHash(
    _minter: string,
    _quantity: number | BN | string,
    _mintId: number | BN | string,
    _nonce: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  getEthSignedMessageHash(
    _messageHash: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  verify(
    _signer: string,
    _minter: string,
    _quantity: number | BN | string,
    _mintId: number | BN | string,
    _nonce: number | BN | string,
    signature: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  recoverSigner(
    _ethSignedMessageHash: string,
    _signature: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  splitSignature(
    sig: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: string; 1: string; 2: BN }>;

  methods: {
    getMessageHash(
      _minter: string,
      _quantity: number | BN | string,
      _mintId: number | BN | string,
      _nonce: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    getEthSignedMessageHash(
      _messageHash: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    verify(
      _signer: string,
      _minter: string,
      _quantity: number | BN | string,
      _mintId: number | BN | string,
      _nonce: number | BN | string,
      signature: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    recoverSigner(
      _ethSignedMessageHash: string,
      _signature: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    splitSignature(
      sig: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: string; 1: string; 2: BN }>;
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