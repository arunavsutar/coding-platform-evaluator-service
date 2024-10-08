import { IJob } from "../types/bullMq.jobDefination";
import { Job } from "bullmq";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/executor.factory";
import codeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutor.strategy";
import evaluationQueueProducer from "../producers/evaluation.queue.producer";
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
            const outputCase = this.payload[key].outputCase;
            console.log("Key = ", key);
            console.log("payload = ", this.payload);
            console.log("payload [key] = ", this.payload[key]);
            console.log("Language = ", codeLanguage);
            console.log("code = ", code);
            console.log("THE Submission ID = ", this.payload[key].submissionId);


            const strategy: codeExecutorStrategy | null = createExecutor(codeLanguage);
            if (strategy !== null) {

                const response: ExecutionResponse = await strategy.execute(code, inputCase, outputCase)
                evaluationQueueProducer({
                    response: response,
                    userId: this.payload[key].userId,
                    submissionId: this.payload[key].submissionId
                });
                if (response.status === 'Success') {
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