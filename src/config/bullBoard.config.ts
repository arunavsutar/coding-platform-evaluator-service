//import sampleQueue from "../queues/sample.queue";
import submissionQueue from "../queues/submission.queue";

const { ExpressAdapter } = require('@bull-board/express');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { createBullBoard } = require('@bull-board/api');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [new BullAdapter(submissionQueue)],
    serverAdapter: serverAdapter,
});

export default serverAdapter;
