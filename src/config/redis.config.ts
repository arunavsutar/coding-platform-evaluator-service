import Redis from "ioredis";
import SERVER_CONFIG from './server.config';
const redisConfig = {
    host: SERVER_CONFIG.REDIS_HOST,
    port: SERVER_CONFIG.REDIS_PORT,
    maxRetriesPerRequest:null 
};

const redisConnection = new Redis(redisConfig);
export default redisConnection;