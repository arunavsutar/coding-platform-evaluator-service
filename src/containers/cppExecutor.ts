import codeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutor.strategy";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeBufferString from "./dockerHelper";
import pullImage from "./pullContainer";

class CppExecutor implements codeExecutorStrategy {
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
        const rawLogBuffer: Buffer[] = [];
        console.log("Initialising a new CPP Container.");
        await pullImage(CPP_IMAGE);
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
        loggerstream.on('data', (chunk) => {
            rawLogBuffer.push(chunk);
        });
        try {
            const codeResponse: string = await this.fetchDecodedStream(loggerstream, rawLogBuffer);
            return { output: codeResponse, status: "COMPLETED" };
        } catch (error) {
            return { output: error as string, status: "ERROR" };
        } finally {

            await cppDockerContainer.remove();
        }

        //return codeResponse;
    }

    fetchDecodedStream(loggerstream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]): Promise<string> {
        return new Promise((res, rej) => {
            loggerstream.on('end', () => {
                console.log(rawLogBuffer);
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodedStream = decodeBufferString(completeBuffer);
                console.log("stdout =");
                console.log(decodedStream.stdout);
                console.log("stderr =\n", decodedStream.stderr);
                if (decodedStream.stdout) {
                    res(decodedStream.stdout);
                }
                else {

                    rej(decodedStream.stderr);
                }
            });
        });
    }
}

export default CppExecutor;