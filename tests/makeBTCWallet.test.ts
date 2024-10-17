import {generateBTCAddressFromMnemonic} from "../src/makeBTCWallet";
import {BTCAddressInfo, AddressType} from '../src/types/wallet';
import * as bitcoin from 'bitcoinjs-lib';

const mnemonicStr: string = "guess category verb rebuild amateur excite fire add bench head blue vital race average swallow material brave spoon museum also mirror lake supreme awful";

describe('generateBTCAddressFromMnemonic', () => {
    test("生成HD钱包 - 正常使用", async () => {
        // 调用函数并等待结果
        // const walletInfo:BTCAddressInfo = await generateBTCAddressFromMnemonic(mnemonicStr, AddressType.P2PKH, bitcoin.networks.testnet);

        // 检查返回值是否匹配预期
        // expect(walletInfo.mnemonic).toBe(mnemonicStr); // 助记词应该和输入的一致
        // expect(walletInfo.privateKey).toBeDefined(); // 私钥应该存在
        // expect(walletInfo.publicKey).toBeDefined();  // 公钥应该存在
        // expect(walletInfo.address).toBeDefined();    // 地址应该存在

        // 验证地址格式
        const walletInfoP2PKH:BTCAddressInfo = await generateBTCAddressFromMnemonic(mnemonicStr, AddressType.P2PKH, bitcoin.networks.testnet);
        const walletInfoP2SH:BTCAddressInfo = await generateBTCAddressFromMnemonic(mnemonicStr, AddressType.P2SH, bitcoin.networks.testnet);
        const walletInfoBECH32:BTCAddressInfo = await generateBTCAddressFromMnemonic(mnemonicStr, AddressType.BECH32, bitcoin.networks.testnet);
        const walletInfoTAPROOT:BTCAddressInfo = await generateBTCAddressFromMnemonic(mnemonicStr, AddressType.TAPROOT, bitcoin.networks.testnet);

        console.log("P2PKH", walletInfoP2PKH)
        // 主网地址：
        // 测试网地址：2MxT7NPD5w8bVVkh7LATActbvdm1pGNWchG
        console.log("P2SH", walletInfoP2SH)
        // 主网地址：
        // 测试网地址：tb1qrm63pp9qya6vhh69d6mquu3ygjrmm38ezzp0dc
        console.log("BECH32", walletInfoBECH32)
        // 主网地址：
        // 测试网地址：tb1puyx8deu7k9fky80ahrkaphrat85az9ss8q8fn05efdc3f34hz08qj89xpy
        console.log("TAPROOT", walletInfoTAPROOT)
    });
});
