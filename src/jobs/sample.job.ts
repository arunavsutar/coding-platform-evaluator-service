import { Job } from "bullmq";

import { IJob } from "../types/bullMq.jobDefination";

export default class SampleJob implements IJob {
    name: string;
    payload: Record<string, unknown>;
    constructor(payload: Record<string, unknown>) {
        this.name = this.constructor.name;
        this.payload = payload;
    };
    handle = () => {
        console.log("Handler of the job called.");
    };
    failed = (job?: Job): void => {
        console.log("Job Failed.");
        if(job){
            console.log(job.id);
        }
    }
};
