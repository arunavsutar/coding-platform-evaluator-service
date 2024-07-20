import submissionQueue from "../queues/submission.queue";

export default async function ( payload: Record<string, unknown>) {
    await submissionQueue.add("SubmissionJob", payload);
    console.log("Successfully added a new Job.");
}