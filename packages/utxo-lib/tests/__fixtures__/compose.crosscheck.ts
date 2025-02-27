import { UTXO } from './compose';
import {
    ComposeChangeAddress,
    ComposeInput,
    ComposeOutput,
    ComposeRequest,
} from '../../src/types/compose';
import { CoinSelectPaymentType } from '../../src';

type AnyComposeRequest = ComposeRequest<ComposeInput, ComposeOutput, ComposeChangeAddress>;

type Fixture = {
    description: string;
    request: Omit<AnyComposeRequest, 'network'> & {
        network?: AnyComposeRequest['network'];
    };
    result: Partial<Record<`${CoinSelectPaymentType}-${CoinSelectPaymentType}`, { bytes: number }>>;
};

export const fixturesCrossCheck: Fixture[] = [
    {
        description: '1 input, 1 output, no change',
        request: {
            changeAddress: { address: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT' },
            dustThreshold: 546,
            feeRate: '10',
            sortingStrategy: 'bip69',
            utxos: [{ ...UTXO, amount: 'replace-me' }],
            outputs: [
                {
                    address: 'replace-me',
                    amount: '100000',
                    type: 'payment',
                },
            ],
        },
        result: {
            'p2pkh-p2pkh': { bytes: 192 }, // https://btc1.trezor.io/tx/b676df70d6f1f14eca0dc947e831b319236e3ac9a3a90b6601ec8956fc4da369
            'p2pkh-p2sh': { bytes: 190 }, // should be 189? https://btc1.trezor.io/tx/f80c22b750cef6eae1a0b880b9ec0ebb1fa8cbe88d57de25dd270842628bd0e6
            'p2pkh-p2tr': { bytes: 201 },
            'p2pkh-p2wpkh': { bytes: 189 }, // https://btc1.trezor.io/tx/ea6add0bcaf36cd495b269c8af47d9f330095d14d6cbf9c6c24bed83b53f2bf2
            'p2pkh-p2wsh': { bytes: 201 },
            'p2sh-p2pkh': { bytes: 136 }, // https://btc1.trezor.io/tx/6e6ad85c99bfb6ed7c0fa3ec99af02dfcdb805aeda36674bbeb3960bfc6418ba
            'p2sh-p2sh': { bytes: 134 }, // https://btc1.trezor.io/tx/d10a4078b8d557ec5280a202fa7df7be8838b4c9f7265ee4ed7737700257cbf7
            'p2sh-p2tr': { bytes: 145 },
            'p2sh-p2wpkh': { bytes: 133 },
            'p2sh-p2wsh': { bytes: 145 },
            'p2tr-p2pkh': { bytes: 102 },
            'p2tr-p2sh': { bytes: 100 },
            'p2tr-p2tr': { bytes: 111 },
            'p2tr-p2wpkh': { bytes: 99 },
            'p2tr-p2wsh': { bytes: 111 }, // https://btc1.trezor.io/tx/9f472739fa7034dfb9736fa4d98915f2e8ddf70a86ee5e0a9ac0634f8c1d0007
            'p2wpkh-p2pkh': { bytes: 113 },
            'p2wpkh-p2sh': { bytes: 111 },
            'p2wpkh-p2tr': { bytes: 122 },
            'p2wpkh-p2wpkh': { bytes: 110 },
            'p2wpkh-p2wsh': { bytes: 122 },
        },
    },
    {
        description: '1 input, 1 output, 1 change',
        request: {
            changeAddress: { address: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT' },
            dustThreshold: 546,
            feeRate: '10',
            sortingStrategy: 'bip69',
            utxos: [{ ...UTXO, amount: '202300' }],
            outputs: [
                {
                    address: 'replace-me',
                    amount: '100000',
                    type: 'payment',
                },
            ],
        },
        result: {
            'p2pkh-p2pkh': { bytes: 226 },
            'p2pkh-p2sh': { bytes: 224 }, // should be 223? https://btc3.trezor.io/tx/918f59f7144fa389f66b6776e3417e1ec356214e18684050237acc056d5efbc1
            'p2pkh-p2tr': { bytes: 235 },
            'p2pkh-p2wpkh': { bytes: 223 },
            'p2pkh-p2wsh': { bytes: 235 },
            'p2sh-p2pkh': { bytes: 168 },
            'p2sh-p2sh': { bytes: 166 }, // https://btc1.trezor.io/tx/941eb4e6deded748848388cb110d7fdfc8ff9512028f21efd39854bdb1e34305
            'p2sh-p2tr': { bytes: 177 },
            'p2sh-p2wpkh': { bytes: 165 }, // https://btc3.trezor.io/tx/fa80a9949f1094119195064462f54d0e0eabd3139becd4514ae635b8c7fe3a46
            'p2sh-p2wsh': { bytes: 177 },
            'p2tr-p2pkh': { bytes: 145 },
            'p2tr-p2sh': { bytes: 143 },
            'p2tr-p2tr': { bytes: 154 },
            'p2tr-p2wpkh': { bytes: 142 },
            'p2tr-p2wsh': { bytes: 154 },
            'p2wpkh-p2pkh': { bytes: 144 },
            'p2wpkh-p2sh': { bytes: 142 },
            'p2wpkh-p2tr': { bytes: 153 },
            'p2wpkh-p2wpkh': { bytes: 141 }, // https://btc3.trezor.io/tx/5dfd1b037633adc7f84a17b2df31c9994fe50b3ab3e246c44c4ceff3d326f62e
            'p2wpkh-p2wsh': { bytes: 153 },
        },
    },
    {
        description: '2 inputs, 1 output, 1 change',
        request: {
            changeAddress: { address: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT' },
            dustThreshold: 546,
            feeRate: '10',
            sortingStrategy: 'bip69',
            utxos: [
                {
                    ...UTXO,
                    txid: 'b4dc0ffeee',
                    amount: '100000',
                },
                {
                    ...UTXO,
                    vout: 1,
                    txid: 'b4dc0ffeee',
                    amount: '50000',
                },
            ],
            outputs: [
                {
                    address: 'replace-me',
                    amount: '100000',
                    type: 'payment',
                },
            ],
        },
        result: {
            'p2pkh-p2pkh': { bytes: 374 },
            'p2pkh-p2sh': { bytes: 372 },
            'p2pkh-p2tr': { bytes: 383 },
            'p2pkh-p2wpkh': { bytes: 371 },
            'p2pkh-p2wsh': { bytes: 383 },
            'p2sh-p2pkh': { bytes: 259 },
            'p2sh-p2sh': { bytes: 257 },
            'p2sh-p2tr': { bytes: 268 },
            'p2sh-p2wpkh': { bytes: 256 }, // https://btc3.trezor.io/tx/799a8923515e0303b15dda074b8341b2cf5efab946fce0d68a6614f32a8fc935
            'p2sh-p2wsh': { bytes: 268 },
            'p2tr-p2pkh': { bytes: 203 },
            'p2tr-p2sh': { bytes: 201 },
            'p2tr-p2tr': { bytes: 212 },
            'p2tr-p2wpkh': { bytes: 200 }, // https://tbtc1.trezor.io/tx/48bc29fc42a64b43d043b0b7b99b21aa39654234754608f791c60bcbd91a8e92
            'p2tr-p2wsh': { bytes: 212 },
            'p2wpkh-p2pkh': { bytes: 212 },
            'p2wpkh-p2sh': { bytes: 210 },
            'p2wpkh-p2tr': { bytes: 221 },
            'p2wpkh-p2wpkh': { bytes: 209 },
            'p2wpkh-p2wsh': { bytes: 221 },
        },
    },
    {
        description: '7 inputs, all-types of outputs, 1 op_return, 1 change',
        request: {
            changeAddress: { address: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT' },
            dustThreshold: 546,
            feeRate: '10',
            sortingStrategy: 'bip69',
            utxos: [
                {
                    ...UTXO,
                    vout: 0,
                    txid: 'b4dc0ffeee',
                    amount: '120000',
                },
                {
                    ...UTXO,
                    vout: 1,
                    txid: 'b4dc0ffeee',
                    amount: '10000',
                },
                {
                    ...UTXO,
                    vout: 2,
                    txid: 'b4dc0ffeee',
                    amount: '10000',
                },
                {
                    ...UTXO,
                    vout: 3,
                    txid: 'b4dc0ffeee',
                    amount: '10000',
                },
                {
                    ...UTXO,
                    vout: 4,
                    txid: 'b4dc0ffeee',
                    amount: '10000',
                },
                {
                    ...UTXO,
                    vout: 5,
                    txid: 'b4dc0ffeee',
                    amount: '10000',
                },
                {
                    ...UTXO,
                    vout: 6,
                    txid: 'b4dc0ffeee',
                    amount: '10000',
                },
            ],
            outputs: [
                {
                    address: 'p2pkh',
                    amount: '50000',
                    type: 'payment',
                },
                {
                    address: 'p2sh',
                    amount: '50000',
                    type: 'payment',
                },
                {
                    address: 'p2tr',
                    amount: '25000',
                    type: 'payment',
                },
                {
                    address: 'p2wpkh',
                    amount: '20000',
                    type: 'payment',
                },
                {
                    address: 'p2wsh',
                    amount: '20000',
                    type: 'payment',
                },
                {
                    type: 'opreturn',
                    dataHex: 'deadbeef',
                },
            ],
        },
        result: {
            'p2pkh-p2pkh': { bytes: 1278 },
            'p2pkh-p2sh': { bytes: 1278 },
            'p2pkh-p2tr': { bytes: 1278 },
            'p2pkh-p2wpkh': { bytes: 1278 },
            'p2pkh-p2wsh': { bytes: 1278 },
            'p2sh-p2pkh': { bytes: 878 },
            'p2sh-p2sh': { bytes: 878 },
            'p2sh-p2tr': { bytes: 878 },
            'p2sh-p2wpkh': { bytes: 878 },
            'p2sh-p2wsh': { bytes: 878 },
            'p2tr-p2pkh': { bytes: 654 },
            'p2tr-p2sh': { bytes: 654 },
            'p2tr-p2tr': { bytes: 654 },
            'p2tr-p2wpkh': { bytes: 654 },
            'p2tr-p2wsh': { bytes: 654 },
            'p2wpkh-p2pkh': { bytes: 716 },
            'p2wpkh-p2sh': { bytes: 716 },
            'p2wpkh-p2tr': { bytes: 716 },
            'p2wpkh-p2wpkh': { bytes: 716 },
            'p2wpkh-p2wsh': { bytes: 716 },
        },
    },
];
