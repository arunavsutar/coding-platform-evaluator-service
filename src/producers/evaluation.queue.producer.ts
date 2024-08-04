import evaluationQueue from "../queues/evaluation.queue";

export default async function evaluationQueueProducer(payload: Record<string, unknown>) {
    try {
        const response = await evaluationQueue.add('evaluationJob', payload)
        console.log("Successfully added a Evaluated JOB.");
        return response;

    } catch (error) {
        throw error;
    }
}