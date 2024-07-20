import { Worker, Job } from "bullmq";
import SubmissionJob from "../jobs/submission.job";
import redisConnection from "../config/redis.config";


export function SubmissionWorker(queueName: string) {

    new Worker(queueName,
        async (job: Job) => {
            if (job.name === 'SubmissionJob') {
                const submissionJobInstatnce = new SubmissionJob(job.data);
                submissionJobInstatnce.handle(job);
                return true;
            }
        }, { connection: redisConnection });
}