import sampleQueue from "../queues/sample.queue";

const { ExpressAdapter } = require('@bull-board/express');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { createBullBoard } = require('@bull-board/api');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [new BullAdapter(sampleQueue)],
    serverAdapter: serverAdapter,
});

export default serverAdapter;
