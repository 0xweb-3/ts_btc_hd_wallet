import {generateBTCAddressFromMnemonic} from "../src/makeBTCWallet";
import {BTCAddressInfo, AddressType} from '../src/types/wallet';

const mnemonicStr: string = "guess category verb rebuild amateur excite fire add bench head blue vital race average swallow material brave spoon museum also mirror lake supreme awful";

describe('generateBTCAddressFromMnemonic', () => {
    test("生成HD钱包 - 正常使用", async () => {
        // 调用函数并等待结果
        const walletInfo:BTCAddressInfo = await generateBTCAddressFromMnemonic(mnemonicStr, AddressType.P2PKH);

        // 检查返回值是否匹配预期
        // expect(walletInfo.mnemonic).toBe(mnemonicStr); // 助记词应该和输入的一致
        // expect(walletInfo.privateKey).toBeDefined(); // 私钥应该存在
        // expect(walletInfo.publicKey).toBeDefined();  // 公钥应该存在
        // expect(walletInfo.address).toBeDefined();    // 地址应该存在

        // 验证地址格式
        const walletInfoP2SH:BTCAddressInfo = await generateBTCAddressFromMnemonic(mnemonicStr, AddressType.P2SH);
        const walletInfoBECH32:BTCAddressInfo = await generateBTCAddressFromMnemonic(mnemonicStr, AddressType.BECH32);
        const walletInfoTAPROOT:BTCAddressInfo = await generateBTCAddressFromMnemonic(mnemonicStr, AddressType.TAPROOT);

        // console.log("P2PKH", walletInfo)
        // console.log("P2SH", walletInfoP2SH) // 36tuJeH4Kg69Hy4Zf2qHzwcfRQoeVtvPKR
        // console.log("BECH32", walletInfoBECH32) // bc1qrm63pp9qya6vhh69d6mquu3ygjrmm38egy6ukt
        console.log("TAPROOT", walletInfoTAPROOT) // bc1puyx8deu7k9fky80ahrkaphrat85az9ss8q8fn05efdc3f34hz08q90nfmt
    });
});
