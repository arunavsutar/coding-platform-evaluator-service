import { Worker, Job } from "bullmq";
import SampleJob from "../jobs/sample.job";
import redisConnection from "../config/redis.config";


export function SampleWorker(queueName: string) {

    new Worker(queueName,
        async (job: Job) => {
            console.log("Samole JOb worker Kicking", job);

            if (job.name === 'SampleJob') {
                const sampleJobInstatnce = new SampleJob(job.data);
                sampleJobInstatnce.handle(job);
                return true;
            }
        }, { connection: redisConnection });
}