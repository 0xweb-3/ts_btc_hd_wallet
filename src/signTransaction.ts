import * as bitcoin from 'bitcoinjs-lib';
import * as ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';

import { BTCAddressInfo, AddressType, TransactionInput, TransactionOutput } from './types/wallet';

// 使用 ecpair 生成密钥对
const ECPair = ECPairFactory.ECPairFactory(ecc);

/**
 * 签名交易
 * @param addressInfo 包含地址、私钥、公钥、助记词等信息
 * @param inputs 交易输入数组
 * @param outputs 交易输出数组
 * @param addressType 地址类型（P2PKH, P2SH, BECH32, TAPROOT）
 * @returns 签名的原始交易
 */
export function signTransaction(
    addressInfo: BTCAddressInfo,
    inputs: TransactionInput[],
    outputs: TransactionOutput[],
    addressType: AddressType,
    network: bitcoin.Network = bitcoin.networks.bitcoin, // 主网，可根据需要改为 testnet
): string {
    // 1. 创建未签名交易
    const psbt = new bitcoin.Psbt({ network });

    // 2. 添加输入
    inputs.forEach(input => {
        let scriptPubKeyBuffer = Buffer.from(input.scriptPubKey, 'hex');
        const isSegwit = addressType === AddressType.BECH32 || addressType === AddressType.P2SH;

        if (isSegwit) {
            // 确保是 SegWit 脚本
            psbt.addInput({
                hash: input.txId,
                index: input.index,
                witnessUtxo: {
                    script: scriptPubKeyBuffer,
                    value: input.amount
                }
            });
        } else {
            // 使用非 SegWit 脚本
            psbt.addInput({
                hash: input.txId,
                index: input.index,
                nonWitnessUtxo: scriptPubKeyBuffer // 这里确保非 SegWit 输入
            });
        }
    });

    // 3. 添加输出
    outputs.forEach(output => {
        let payment: bitcoin.payments.Payment;

        switch (addressType) {
            case AddressType.P2PKH:
                payment = bitcoin.payments.p2pkh({ address: output.address, network });
                break;
            case AddressType.P2SH:
                payment = bitcoin.payments.p2sh({
                    redeem: bitcoin.payments.p2wpkh({ address: output.address, network })
                });
                break;
            case AddressType.BECH32:
                payment = bitcoin.payments.p2wpkh({ address: output.address, network });
                break;
            case AddressType.TAPROOT:
                throw new Error('Taproot address signing is not supported yet.');
            default:
                throw new Error(`Unsupported address type: ${addressType}`);
        }

        // 检查 payment.output 是否为 undefined
        if (!payment.output) {
            throw new Error(`Failed to create output script for address: ${output.address}`);
        }

        psbt.addOutput({
            script: payment.output,
            value: output.amount
        });
    });

    // 4. 获取私钥
    const keyPair = ECPair.fromPrivateKey(Buffer.from(addressInfo.privateKey, 'hex'), { network });

    // 5. 根据地址类型签名交易
    inputs.forEach((input, i) => {
        psbt.signInput(i, keyPair);
    });

    // 6. 校验签名，传入自定义的验证签名函数
    psbt.validateSignaturesOfAllInputs((pubkey, msghash, signature) => {
        return ecc.verify(msghash, pubkey, signature);
    });
    psbt.finalizeAllInputs();

    // 7. 导出原始交易
    const signedTransaction = psbt.extractTransaction().toHex();
    return signedTransaction;
}

// export function getScriptPubKey(
//     addressType: AddressType,
//     address: string,
//     network: bitcoin.Network = bitcoin.networks.bitcoin // 默认主网
// ): string {
//     let payment: bitcoin.payments.Payment;
//
//     switch (addressType) {
//         case AddressType.P2PKH:
//             payment = bitcoin.payments.p2pkh({ address, network });
//             break;
//         case AddressType.P2SH:
//             payment = bitcoin.payments.p2sh({
//                 redeem: bitcoin.payments.p2wpkh({ address, network })
//             });
//             break;
//         case AddressType.BECH32:
//             payment = bitcoin.payments.p2wpkh({ address, network });
//             break;
//         case AddressType.TAPROOT:
//             payment = bitcoin.payments.p2wsh({
//                 redeem: bitcoin.payments.p2wpkh({ address, network })
//             });
//             break;
//         default:
//             throw new Error(`Unsupported address type: ${addressType}`);
//     }
//
//     return payment.output?.toString() || '';
// }
