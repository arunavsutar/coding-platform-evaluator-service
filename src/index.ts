import express from "express";
import serverConfig from "./config/server.config";
import apirouter from "./routes";
import sampleQueueProducer from "./producers/sample.queue.producer";
import { SampleWorker } from "./workers/sample.worker";

const app = express();

app.use('/api', apirouter);


app.listen(serverConfig.PORT, () => {
    console.log(`Server started at *:${serverConfig.PORT}`);
    console.log("Helllo");
    SampleWorker('SampleQueue');
    sampleQueueProducer('SampleJob', {
        name: "Deepak",
        company: "Microsoft",
        position: "SDE 1",
        location: "Remote | Noida"
    }, 2);
    sampleQueueProducer('SampleJob', {
        name: "Arunav",
        company: "Google",
        position: "SDE 1",
        location: "Remote | BLR"
    }, 1);
});