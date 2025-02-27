import type { Network } from '../networks';
import type { CoinSelectPaymentType } from './coinselect';

// UTXO == unspent transaction output = all I can spend
export interface ComposeInput {
    vout: number; // index of output IN THE TRANSACTION
    txid: string; // hash of the transaction
    amount: string; // how much money sent
    coinbase: boolean; // coinbase transaction = utxo from mining, cannot be spend before 100 blocks
    own: boolean; // is the ORIGIN me (the same account)
    confirmations: number; // might be spent immediately (own) or after 6 conf (not own) see ./coinselect/tryConfirmed
    required?: boolean; // must be included into transaction
}

// Output parameter of coinselect algorithm which is either:
//    - 'payment' - address and amount
//    - 'payment-noaddress' - just amount
//    - 'send-max' - address
//    - 'send-max-noaddress' - no other info
//    - 'opreturn' - dataHex
export interface ComposeOutputPayment {
    type: 'payment';
    address: string;
    amount: string;
}

export interface ComposeOutputPaymentNoAddress {
    type: 'payment-noaddress';
    amount: string;
}

export interface ComposeOutputSendMax {
    type: 'send-max'; // only one in TX request
    address: string;
    amount?: typeof undefined;
}

export interface ComposeOutputSendMaxNoAddress {
    type: 'send-max-noaddress';
    amount?: typeof undefined;
}

export interface ComposeOutputOpreturn {
    type: 'opreturn'; // it doesn't need to have address
    dataHex: string;
    amount?: typeof undefined;
    address?: typeof undefined;
}

// NOTE: this interface **is not** accepted by ComposeRequest['utxos']
// it's optionally created by the process from ComposeChangeAddress data
// but it's returned in ComposedTransaction['outputs']
export interface ComposeOutputChange {
    type: 'change';
    amount: string;
}

export type ComposeFinalOutput =
    | ComposeOutputPayment
    | ComposeOutputSendMax
    | ComposeOutputOpreturn;

export type ComposeNotFinalOutput = ComposeOutputPaymentNoAddress | ComposeOutputSendMaxNoAddress;

export type ComposeOutput = ComposeFinalOutput | ComposeNotFinalOutput;

export interface ComposeChangeAddress {
    address: string;
}

export type TransactionInputOutputSortingStrategy =
    // BIP69 sorting
    | 'bip69'

    // Inputs are randomized, outputs are kept as they were provided in the request,
    // and change is randomly placed somewhere between outputs
    | 'random'

    // It keeps the inputs and outputs as they were provided in the request.
    // This is useful for RBF transactions where the order of inputs and outputs must be preserved.
    | 'none';

export type ComposeRequest<
    Input extends ComposeInput,
    Output extends ComposeOutput,
    Change extends ComposeChangeAddress,
> = {
    txType?: CoinSelectPaymentType;
    utxos: Input[]; // all inputs
    outputs: Output[]; // all outputs
    feeRate: string | number; // in sat/byte, virtual size
    longTermFeeRate?: string | number; // dust output feeRate multiplier in sat/byte, virtual size
    network: Network;
    changeAddress: Change;
    dustThreshold: number; // explicit dust threshold, in satoshi
    baseFee?: number; // DOGE or RBF base fee
    floorBaseFee?: boolean; // DOGE floor base fee to the nearest integer
    skipUtxoSelection?: boolean; // use custom utxo selection, without algorithm
    sortingStrategy: TransactionInputOutputSortingStrategy;
};

type ComposedTransactionOutputs<T> = T extends ComposeOutputSendMax
    ? Omit<T, 'type'> & ComposeOutputPayment // NOTE: replace ComposeOutputSendMax (no amount) with ComposeOutputPayment (with amount)
    : T extends ComposeFinalOutput
      ? T
      : never;

export interface ComposedTransaction<
    Input extends ComposeInput,
    Output extends ComposeOutput,
    Change extends ComposeChangeAddress,
> {
    inputs: Input[];
    outputs: (ComposedTransactionOutputs<Output> | (Change & ComposeOutputChange))[];
    outputsPermutation: number[];
}

// Result from `composeTx` module
// 'nonfinal' - contains partial info about the inputs/outputs but not the transaction data
// 'final' - contains all info about the inputs/outputs and transaction data
// 'error' - validation or runtime error. expected error types are listed below

export const COMPOSE_ERROR_TYPES = [
    'MISSING-UTXOS',
    'MISSING-OUTPUTS',
    'INCORRECT-FEE-RATE',
    'NOT-ENOUGH-FUNDS',
] as const;

export type ComposeResultError =
    | {
          type: 'error';
          error: (typeof COMPOSE_ERROR_TYPES)[number];
      }
    | {
          type: 'error';
          error: 'INCORRECT-UTXO' | 'INCORRECT-OUTPUT' | 'COINSELECT';
          message: string;
      };

export interface ComposeResultNonFinal<Input extends ComposeInput> {
    type: 'nonfinal';
    max?: string;
    totalSpent: string; // all the outputs, no fee, no change
    fee: string;
    feePerByte: string;
    bytes: number;
    inputs: Input[];
}

export interface ComposeResultFinal<
    Input extends ComposeInput,
    Output extends ComposeOutput,
    Change extends ComposeChangeAddress,
> extends ComposedTransaction<Input, Output, Change> {
    type: 'final';
    max?: string;
    totalSpent: string; // all the outputs, no fee, no change
    fee: string;
    feePerByte: string;
    bytes: number;
    inputs: Input[];
    outputs: (ComposedTransactionOutputs<Output> | (Change & ComposeOutputChange))[];
    outputsPermutation: number[];
}

export type ComposeResult<
    Input extends ComposeInput,
    Output extends ComposeOutput,
    Change extends ComposeChangeAddress,
> = ComposeResultError | ComposeResultNonFinal<Input> | ComposeResultFinal<Input, Output, Change>;
