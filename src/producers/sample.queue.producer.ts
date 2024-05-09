import sampleQueue from "../queues/sample.queue";

export default async function (name: string, payload: Record<string, unknown>) {
    await sampleQueue.add(name, payload);
    console.log("Successfully Added the new JOB.");

}