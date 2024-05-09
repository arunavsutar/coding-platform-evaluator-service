import { Job } from "bullmq";

import { IJob } from "../types/bullMq.jobDefination";

export default class SampleJob implements IJob {
    name: string;
    payload: Record<string, unknown>;
    constructor(payload: Record<string, unknown>) {
        this.name = this.constructor.name;
        this.payload = payload;
    };
    handle = (job?: Job) => {
        console.log("Handler of the job called.");
        console.log(this.payload);
        if (job) {
            console.log(job.id,job.data,job.name);
        }
    };
    failed = (job?: Job): void => {
        console.log("Job Failed.");
        if (job) {
            console.log(job.id);
        }
    }
};
