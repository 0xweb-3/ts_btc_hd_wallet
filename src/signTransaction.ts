import * as bitcoin from 'bitcoinjs-lib';
import * as ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';

import {BTCAddressInfo, AddressType} from './types/wallet';

// 使用 ecpair 生成密钥对
const ECPair = ECPairFactory.ECPairFactory(ecc);

interface TransactionInput {
    txId: string;   // 输入交易的ID
    index: number;  // 输入交易的索引
    amount: bigint; // 输入交易的金额
    scriptPubKey: string;  // 锁定脚本（根据地址类型生成）
}

interface TransactionOutput {
    address: string; // 输出地址
    amount: bigint;  // 输出金额
}

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
    // 1. 创建 Bitcoin 网络参数
    // const network = bitcoin.networks.bitcoin; // 主网，可根据需要改为 testnet

    // 2. 创建未签名交易
    const psbt = new bitcoin.Psbt({network});

    // 3. 添加输入
    inputs.forEach(input => {
        psbt.addInput({
            hash: input.txId,
            index: input.index,
            witnessUtxo: {
                script: Buffer.from(input.scriptPubKey, 'hex'),
                value: input.amount
            }
        });
    });

    // 4. 添加输出
    outputs.forEach(output => {
        psbt.addOutput({
            address: output.address,
            value: output.amount
        });
    });

    // 5. 获取私钥
    const keyPair = ECPair.fromWIF(addressInfo.privateKey, network);

    // 6. 根据地址类型签名交易
    switch (addressType) {
        case AddressType.P2PKH:
            inputs.forEach((input, i) => {
                psbt.signInput(i, keyPair);
            });
            break;

        case AddressType.P2SH:
            // P2SH 签名方式
            inputs.forEach((input, i) => {
                psbt.signInput(i, keyPair);
            });
            break;

        case AddressType.BECH32:
            inputs.forEach((input, i) => {
                psbt.signInput(i, keyPair);
            });
            break;

        case AddressType.TAPROOT:
            throw new Error('Taproot address signing is not supported yet.');
    }

    // 7. 校验签名，传入自定义的验证签名函数
    psbt.validateSignaturesOfAllInputs((pubkey, msghash, signature) => {
        return ecc.verify(msghash, pubkey, signature);
    });
    psbt.finalizeAllInputs();

    // 8. 导出原始交易
    const signedTransaction = psbt.extractTransaction().toHex();
    return signedTransaction;
}
