import {wordlists} from "bip39";
import {randomBytes} from 'crypto';

const bip39Words: string[] = wordlists.english;

/**
 * 生成随机熵
 * @param bitsNumber 助记词所对应的位数， 12、15、18、21 或 24 个单词对应bitsNumber值分别为：
 * 128, 160, 192, 224, 256
 */
function generateEntropy(bitsNumber: number): Uint8Array {
    // 是否为期望的助记词长度
    if (![128, 160, 192, 224, 256].includes(bitsNumber)) {
        throw new Error("Invalid entropy length. Choose 128, 160, 192, 224, or 256 bits.");
    }

    const entropyBytes: number = bitsNumber / 8;
    const randomBytesArray: Uint8Array = randomBytes(entropyBytes);
    return randomBytesArray;
}


/**
 * 计算校验和
 * @param entropyBytes:generateEntropy函数计算产生的随机数
 */
export async function calculateChecksum(entropyBytes: Uint8Array): Promise<Uint8Array> {
    const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', entropyBytes);
    const hashBytes: Uint8Array = new Uint8Array(hashBuffer);
    // 校验和长度应为熵长度的1/32，即 1 字节
    return hashBytes.slice(0, 1); // 修改为返回 1 字节
}

/**
 * 组合熵和校验和
 * @param entropyBytes 随机熵
 * @param checksumBytes 校验和
 */
function combineEntropyAndChecksum(entropyBytes: Uint8Array, checksumBytes: Uint8Array): Uint8Array {
    const combined: Uint8Array = new Uint8Array(entropyBytes.length + checksumBytes.length);
    combined.set(entropyBytes);
    combined.set(checksumBytes, entropyBytes.length);
    return combined;
}

/**
 * 分割为助记词索引
 * @param combinedBytes  组合后的熵和校验和
 */
function splitIntoWords(combinedBytes: Uint8Array): number[] {
    const bits: string = Array.from(combinedBytes).map(byte => byte.toString(2).padStart(8, '0')).join('');
    const wordIndices: number[] = [];

    // 每 11 位作为一个索引
    for (let i = 0; i < bits.length; i += 11) {
        // 处理不足 11 位的情况
        const segment: string = bits.substr(i, 11);
        if (segment.length === 11) {
            wordIndices.push(parseInt(segment, 2));
        }
    }

    return wordIndices;
}

/**
 * 映射为助记词
 * @param wordIndices splitIntoWords生成的助记词索引
 */
function mapToWords(wordIndices: number[]): string[] {
    return wordIndices.map(index => bip39Words[index]);
}

/**
 * 生成助记词
 * @param bits
 */
export async function generateMnemonic(bits:number) {
    if (![128, 160, 192, 224, 256].includes(bits)) {
        throw new Error('Invalid entropy length. Choose 128, 160, 192, 224, or 256 bits.');
    }

    const entropyBytes:Uint8Array = generateEntropy(bits);
    const checksumBytes:Uint8Array = await calculateChecksum(entropyBytes);
    const combinedBytes:Uint8Array = combineEntropyAndChecksum(entropyBytes, checksumBytes);

    // 调试输出
    // console.log(`Entropy Bytes: ${Array.from(entropyBytes)}`);
    // console.log(`Checksum Bytes: ${Array.from(checksumBytes)}`);
    // console.log(`Combined Bytes: ${Array.from(combinedBytes)}`);

    const wordIndices = splitIntoWords(combinedBytes);

    // 确保生成的助记词数量与预期一致
    // console.log(`Word Indices: ${wordIndices}`);
    const mnemonic:string = mapToWords(wordIndices).join(' ');
    return mnemonic;
}
