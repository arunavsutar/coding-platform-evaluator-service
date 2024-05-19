import express from "express";
import serverAdapter from "./config/bullBoard.config";
import serverConfig from "./config/server.config";
import apirouter from "./routes";
//import sampleQueueProducer from "./producers/sample.queue.producer";
//import { SampleWorker } from "./workers/sample.worker";
import bodyParser from "body-parser";
import runPython from "./containers/runPythonDocker";


const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/api', apirouter);
app.use('/admin/queues', serverAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
    console.log(`Server started at *:${serverConfig.PORT}`);
    console.log("Helllo");
    // SampleWorker('SampleQueue');
    // sampleQueueProducer('SampleJob', {
    //     name: "Deepak",
    //     company: "Microsoft",
    //     position: "SDE 1",
    //     location: "Remote | Noida"
    // }, 2);
    // sampleQueueProducer('SampleJob', {
    //     name: "Arunav",
    //     company: "Google",
    //     position: "SDE 1",
    //     location: "Remote | BLR"
    // }, 1);



    //The issue can be if any code is having a single cote inside a double cote then that can throw some error.
    const code = `
a=int(input())
b=int(input())
for i in range(a):
    for j in range(b):
        print("*",end="")
    print("")
    `;
    const input = `5
    5`;
    runPython(code, input);
});