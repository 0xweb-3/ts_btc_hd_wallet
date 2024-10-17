// 定义类型接口
export interface UTXO {
    txid: string;
    vout: number;
    value: number;
}

export interface FeeRecommendation {
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
}

export interface ScriptPubKeyResponse {
    scriptPubKey: string;
    isvalid: boolean;
    address: string;
    "isscript": boolean,
    "iswitness": boolean,
    "witness_version": number,
    "witness_program": string
}

// 定义接口（如果你知道 API 的返回数据格式，可以进一步定义）
export interface TxResponse {
    txid: string;
    // 根据需要定义更多字段
}