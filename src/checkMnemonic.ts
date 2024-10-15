import * as crypto from 'crypto';
import {wordlists} from "bip39"; // 用于 SHA-256 哈希

const bip39Words: string[] = wordlists.english;

// 校验助记词的函数
export function validateMnemonic(mnemonic: string): boolean {
    const words = mnemonic.split(' ');

    // 1. 检查单词数量
    if (![12, 15, 18, 21, 24].includes(words.length)) {
        throw new Error('Invalid number of words. Mnemonic should have 12, 15, 18, 21, or 24 words.');
    }

    // 2. 检查单词是否在词汇表中
    for (let word of words) {
        if (!bip39Words.includes(word)) {
            throw new Error(`Invalid word found in mnemonic: ${word}`);
        }
    }

    // 3. 将助记词转化成位串
    let bits = '';
    for (let word of words) {
        const index = bip39Words.indexOf(word);
        const binary = index.toString(2).padStart(11, '0'); // 转换为 11 位二进制数
        bits += binary;
    }

    // 4. 提取种子和校验和
    const entropyBitsLength = (words.length * 11) - (words.length / 3); // 种子位数
    const checksumBitsLength = words.length / 3; // 校验和位数

    const entropyBits = bits.slice(0, entropyBitsLength); // 前面的位数是种子
    const checksumBits = bits.slice(entropyBitsLength); // 最后几位是校验和

    // 5. 计算校验和
    const entropyBytes = binaryToBytes(entropyBits); // 将位串转换为字节
    const hash = crypto.createHash('sha256').update(entropyBytes).digest();
    const computedChecksum = byteToBinary(hash[0]).slice(0, checksumBitsLength); // 取哈希的前 N 位作为校验和

    // 6. 验证校验和
    if (checksumBits !== computedChecksum) {
        throw new Error('Checksum mismatch. Mnemonic is invalid.');
    }

    return true;
}

// 将位串转换为字节数组
function binaryToBytes(binaryString: string): Uint8Array {
    const bytes = new Uint8Array(binaryString.length / 8);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(binaryString.slice(i * 8, i * 8 + 8), 2);
    }
    return bytes;
}

// 将字节转换为二进制位串
function byteToBinary(byte: number): string {
    return byte.toString(2).padStart(8, '0');
}


