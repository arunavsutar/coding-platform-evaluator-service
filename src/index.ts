import express from "express";
import serverAdapter from "./config/bullBoard.config";
import serverConfig from "./config/server.config";
import apirouter from "./routes";
//import sampleQueueProducer from "./producers/sample.queue.producer";
//import { SampleWorker } from "./workers/sample.worker";
import bodyParser from "body-parser";
//import runPython from "./containers/runPythonDocker";
//import runJava from "./containers/runJavaDocker";
//import runCpp from "./containers/runCppDocker";
import { SubmissionWorker } from "./workers/submission.worker";
import submissionQueueProducer from "./producers/submission.queue.producer";
import { submission_queue } from "./utils/constants";


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

    //We can add stub before the code 
    const code = `
    #include<iostream>
    using namespace std;
    int main(){
        int a;
        cin>>a;
        cout<<"Value of a is = "<<a<<endl;
        for (int i=0;i<a;i++){
            cout<<i<<"Hello";
        }
        return 0;
    }
    `;
    //And we can add Stub after the code[Symbol].
    const inputCase = `5`;
    //runCpp(code, input);
    SubmissionWorker(submission_queue);
    submissionQueueProducer({
        "1234": {
            language: "CPP",
            code: code,
            inputCase: inputCase
        }
    });

});