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