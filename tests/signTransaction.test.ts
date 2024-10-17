import {signTransaction} from "../src/signTransaction";
import {getUTXO, getRecommendedFees, getScriptPubKey} from "../src/requestRpc";
import {BTCAddressInfo, AddressType, TransactionInput, TransactionOutput} from '../src/types/wallet';
import * as bitcoin from 'bitcoinjs-lib';

describe("signTransaction", () => {
    test("make BECH32 transaction", async () => {
        // 创建 BTCAddressInfo
        const addressInfo: BTCAddressInfo = {
            address: "tb1qrm63pp9qya6vhh69d6mquu3ygjrmm38ezzp0dc",
            privateKey: "2c3fbf444773a12bd6a04cad5c2eb93f211a40ed4e5a11d5d886b80a1637bdd0",
            publicKey: "037e514eeaaeb01a4e0a5a99d1efac2cd4289277d143433d1a74c0ea6db832cf25",
            mnemonic: "guess category verb rebuild amateur excite fire add bench head blue vital race average swallow material brave spoon museum also mirror lake supreme awful"
        }

        // 获取推荐费用
        const fees = await getRecommendedFees();
        const Fee = BigInt(fees.fastestFee);  // 获取最快费用并转换为 bigint

        // 获取 UTXO
        const utxos = await getUTXO(addressInfo.address);

        // 获取scriptPubKey
        const result = await getScriptPubKey(addressInfo.address);
        const scriptPubKey: string = result.scriptPubKey

        // 检查 UTXO 是否足够
        if (utxos.length === 0) {
            throw new Error("没有可用的 UTXO");
        }

        // 将 UTXO 转换为 TransactionInput[]
        const inputs: TransactionInput[] = utxos.map(utxo => ({
            txId: utxo.txid,
            index: utxo.vout,
            amount: BigInt(utxo.value),  // 转换为 bigint
            scriptPubKey: scriptPubKey, // 使用 UTXO 的地址
        }));

        // 定义发送金额和接收地址  satoshi（1 BTC = 100,000,000 satoshi）。
        const sendAmount = BigInt(1000);  // 发送金额 (satoshis)
        const recipientAddress: string = "tb1qrm63pp9qya6vhh69d6mquu3ygjrmm38ezzp0dc";  // 接收地址

        // 计算找零金额
        const totalInputAmount: bigint = inputs.reduce((acc, input) => acc + input.amount, BigInt(0));
        const changeAmount: bigint = totalInputAmount - sendAmount - Fee; // 扣除手续费

        // 没有找零直接抛出错误
        if (changeAmount < 0) {
            throw new Error("没有足够费用");
        }

        // 定义输出信息，包括找零地址
        const outputs: TransactionOutput[] = [
            {
                address: recipientAddress,  // 接收地址
                amount: sendAmount,  // 发送金额
            },
            {
                address: addressInfo.address,  // 找零地址
                amount: changeAmount > 0 ? changeAmount : BigInt(0),  // 找零金额（确保不小于0）
            },
        ];

        // 调用 signTransaction
        const signedTx = signTransaction(
            addressInfo,
            inputs,
            outputs,
            AddressType.BECH32,    // 使用 BECH32 地址类型
            bitcoin.networks.testnet  // 使用比特币测试网
        );

        // 打印签名交易（可以根据需要进一步断言）
        console.log("Signed Transaction:", signedTx);

        // 示例断言：确保返回值是一个非空字符串
        expect(signedTx).toBeTruthy();
        expect(typeof signedTx).toBe("string");
    });
});
