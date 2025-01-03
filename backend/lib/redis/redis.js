import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

export const storeRefreshToken =  async (accountId, refreshToken) => {
    await redis.set(`refresh_token: ${accountId}`, refreshToken, "EX", 7*24*60*60); 
}