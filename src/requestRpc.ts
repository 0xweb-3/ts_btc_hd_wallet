import axios from 'axios';
import {UTXO, FeeRecommendation,ScriptPubKeyResponse,TxResponse} from "./types/rpc";
import {config} from './config'; // 导入配置

// 定义 API URL
const BASE_URL: string = config.baseUrl;

// 1. 获取指定地址的 UTXO
export async function getUTXO(address: string): Promise<UTXO[]> {
    try {
        const response = await axios.get<UTXO[]>(`${BASE_URL}/address/${address}/utxo`);
        return response.data;
    } catch (error) {
        console.error('Error fetching UTXO:', error);
        throw error;
    }
}

// 2. 获取推荐费用
export async function getRecommendedFees(): Promise<FeeRecommendation> {
    try {
        const response = await axios.get<FeeRecommendation>(`${BASE_URL}/v1/fees/recommended`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recommended fees:', error);
        throw error;
    }
}

// 发送原始交易数据到 mempool.space
export async function sendRawTransaction(rawTx: string): Promise<TxResponse> {
    try {
        const response = await axios.post<TxResponse>(`${BASE_URL}/tx`, rawTx, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error sending raw transaction:', error);
        throw error;
    }
}

// 获取scriptPubKey
export async function getScriptPubKey(address: string): Promise<ScriptPubKeyResponse> {
    try {
        const response = await axios.get<ScriptPubKeyResponse>(`${BASE_URL}/v1/validate-address/${address}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching scriptPubKey:', error);
        throw error;
    }
}

