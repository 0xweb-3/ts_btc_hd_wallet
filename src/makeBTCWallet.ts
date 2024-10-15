import * as bip39 from 'bip39';
import {BIP32Factory} from 'bip32';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import {BTCAddressInfo,AddressType} from './types/wallet';

// 初始化 ECC 库
bitcoin.initEccLib(ecc);

// 创建 bip32 实例
const bip32 = BIP32Factory(ecc);

export function generateBTCAddressFromMnemonic(
    mnemonic: string,
    addressType: AddressType,
    index: number = 0, // 钱包的排序
    isChange: number = 0, // 是否找零地址
    network: bitcoin.Network = bitcoin.networks.bitcoin,
): BTCAddressInfo {
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic');
    }

    // 使用 Buffer.from() 将 Uint8Array 转换为 Buffer
    const seed = Buffer.from(bip39.mnemonicToSeedSync(mnemonic));
    const root = bip32.fromSeed(seed, network);

    let path: string;
    // 根据地址类型选择不同的路径
    switch (addressType) {
        case AddressType.P2PKH:
            path = `m/44'/0'/0'/${isChange}/${index}`; // BIP44路径
            break;
        case AddressType.P2SH:
            path = `m/49'/0'/0'/${isChange}/${index}`; // BIP49路径
            break;
        case AddressType.BECH32:
            path = `m/84'/0'/0'/${isChange}/${index}`; // BIP84路径
            break;
        case AddressType.TAPROOT:
            path = `m/86'/0'/0'/${isChange}/${index}`; // BIP86路径
            break;
        default:
            throw new Error('Unsupported address type');
    }

    const childKey = root.derivePath(path);

    const {publicKey, privateKey} = childKey;
    let address: string;

    if (!privateKey) {
        throw new Error('Private key is undefined'); // 检查 privateKey 是否存在
    }

    switch (addressType) {
        case AddressType.P2PKH:
            const p2pkh = bitcoin.payments.p2pkh({pubkey: publicKey, network});
            address = p2pkh.address!;
            break;

        case AddressType.P2SH:
            const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: publicKey, network });
            const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network });
            if (!p2sh.address) {
                throw new Error('P2SH address generation failed');
            }
            address = p2sh.address; // 这里返回的是 Base58Check 编码的 P2SH 地址
            break;

        case AddressType.BECH32:
            const bech32 = bitcoin.payments.p2wpkh({ pubkey: publicKey, network });
            address = bech32.address!;
            break;

        case AddressType.TAPROOT:
            const internalPubkey = toXOnly(Buffer.from(publicKey)); // 确保将 publicKey 转换为 Buffer
            const taproot = bitcoin.payments.p2tr({internalPubkey, network});
            address = taproot.address!;
            break;
        default:
            throw new Error('Unsupported address type');
    }

    return {
        address,
        privateKey: Buffer.from(privateKey).toString('hex'),
        publicKey: Buffer.from(publicKey).toString('hex'), // 确保转换 publicKey
        mnemonic
    };
}

function toXOnly(pubkey: Buffer): Buffer {
    if (pubkey.length === 33) {
        return pubkey.slice(1); // 移除前缀字节
    } else {
        throw new Error('Invalid public key length'); // 确保公钥长度正确
    }
}

// const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
// console.log('P2PKH Address Info:', generateBTCAddressFromMnemonic(mnemonic, AddressType.P2PKH));
// console.log('P2SH Address Info:', generateBTCAddressFromMnemonic(mnemonic, AddressType.P2SH));
// console.log('Bech32 Address Info:', generateBTCAddressFromMnemonic(mnemonic, AddressType.BECH32));
// console.log('Taproot Address Info:', generateBTCAddressFromMnemonic(mnemonic, AddressType.TAPROOT));
