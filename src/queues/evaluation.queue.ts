import { Queue } from "bullmq";
import redisConnection from "../config/redis.config";

export default new Queue('evaluationQueue',{connection:redisConnection});