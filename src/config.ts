import dotenv from 'dotenv';

// 加载 .env 文件的环境变量
dotenv.config();

// 定义配置接口
interface Config {
    baseUrl: string;
}

// 导出配置对象
export const config: Config = {
    baseUrl: process.env.BASE_URL || 'https://mempool.space/testnet/api',
};
