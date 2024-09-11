import codeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutor.strategy";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import fetchDecodedStream from "../utils/fetch.decoded.stream";
import pullImage from "./pullContainer";

class CppExecutor implements codeExecutorStrategy {
    async execute(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse> {
        const rawLogBuffer: Buffer[] = [];
        console.log("Initialising a new CPP Container.");
        await pullImage(CPP_IMAGE);
        console.log("inputTestcase =>", inputTestCase);
        console.log("outputTestcase =>", outputTestCase);


        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | stdbuf -oL -eL ./main`
        console.log(runCommand);

        const cppDockerContainer = await createContainer(CPP_IMAGE, ['bin/sh', '-c', runCommand]);
        await cppDockerContainer.start();
        console.log("CPP Docker Container started.");

        const loggerstream = await cppDockerContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true     //whether the logs are streamed or returned as a string
        });
        // We can attach events on the stream object to start and stop reading.
        // console.time('operationTime');
        loggerstream.on('data', (chunk) => {
            rawLogBuffer.push(chunk);
        });
        try {
            const codeResponse: string = await fetchDecodedStream(loggerstream, rawLogBuffer);
            if (codeResponse.trim() === outputTestCase.trim()) {
                return { output: codeResponse, status: "Success" };
            }
            else {
                return { output: codeResponse, status: "WA" };
            }

        } catch (error) {
            console.log("Error Ocuured", error);

            if (error === "TLE") {
                console.log("Before killing the container.");

                await cppDockerContainer.kill();

                console.log("After killing the container.");
            }

            return { output: error as string, status: "ERROR" };
        } finally {

            await cppDockerContainer.remove();
        }

        //return codeResponse;
    }

    
}

export default CppExecutor;