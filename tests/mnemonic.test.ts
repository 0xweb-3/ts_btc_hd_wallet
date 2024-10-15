// tests/mnemonic.test.ts
import { generateMnemonic } from '../src/mnemonic';

describe('generateMnemonic', () => {
    test("正常生成助记词", async ()=>{
        const mnemonic  = await generateMnemonic(256)
        console.log(mnemonic)
    })

    test("传入的不是128, 160, 192, 224, 256",  async ()=>{
        await expect(generateMnemonic(100)).rejects.toThrow("Invalid entropy length. Choose 128, 160, 192, 224, or 256 bits.")

    })
});
