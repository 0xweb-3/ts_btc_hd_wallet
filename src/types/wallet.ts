export interface BTCAddressInfo {
    address: string;
    privateKey: string;
    publicKey: string;
    mnemonic: string;
}

export enum AddressType {
    P2PKH = 'p2pkh',
    P2SH = 'p2sh',
    BECH32 = 'bech32',
    TAPROOT = 'taproot'
}

export interface TransactionInput {
    txId: string;   // 输入交易的ID
    index: number;  // 输入交易的索引
    amount: bigint; // 输入交易的金额
    scriptPubKey: string;  // 锁定脚本（根据地址类型生成）
}

export interface TransactionOutput {
    address: string; // 输出地址
    amount: bigint;  // 输出金额
}