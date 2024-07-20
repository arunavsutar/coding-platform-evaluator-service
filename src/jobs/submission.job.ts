import { IJob } from "../types/bullMq.jobDefination";
import { Job } from "bullmq";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/executor.factory";
import codeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutor.strategy";
export default class SubmissionJob implements IJob {
    name: string;
    payload: Record<string, SubmissionPayload>;
    constructor(payload: Record<string, SubmissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }
    handle = async (job?: Job) => {
        if (job) {
            const key = Object.keys(this.payload)[0];
            const codeLanguage = this.payload[key].language;
            const code = this.payload[key].code;
            const inputCase = this.payload[key].inputCase;
            console.log("Language = ", codeLanguage);
            const strategy: codeExecutorStrategy | null = createExecutor(codeLanguage);
            if (strategy !== null) {

                const response: ExecutionResponse = await strategy.execute(code, inputCase)
                if (response.status === 'COMPLETED') {
                    console.log("Code Executed Successfully.");
                    console.log(response);
                }
                else {
                    console.log("Something went wrong with the code Execution.");
                    console.log(response);
                }
            }
            else {
                console.log("Not valid Laguage Provided.");

            }
        }
    };
    failed = (job?: Job) => {
        if (job) {

            console.log("job=", job.name, job.id, job.data);
        }
    };
}