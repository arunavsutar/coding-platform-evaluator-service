import codeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutor.strategy";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeBufferString from "./dockerHelper";
import pullImage from "./pullContainer";

class JavaExecutor implements codeExecutorStrategy {
    async execute(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse> {
        const rawLogBuffer: Buffer[] = [];
        console.log("Initialising a new Java Container.");
        await pullImage(JAVA_IMAGE);
        console.log("inputTestcase =>", inputTestCase);
        console.log("outputTestcase =>", outputTestCase);
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`
        console.log(runCommand);

        const javaDockerContainer = await createContainer(JAVA_IMAGE, ['bin/sh', '-c', runCommand]);
        await javaDockerContainer.start();
        console.log("Java Docker Container started.");

        const loggerstream = await javaDockerContainer.logs({
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
            if (codeResponse.trim() === outputTestCase.trim()) {

                return { output: codeResponse, status: "SUCCESS" };
            }
            else {
                return { output: codeResponse, status: "WA" };
            }
        } catch (error) {
            console.log(error);
            if (error === 'TLE') {
                await javaDockerContainer.kill();
            }
            return { output: error as string, status: "ERROR" };
        } finally {

            await javaDockerContainer.remove();
        }

        //return codeResponse;
    }

    fetchDecodedStream(loggerstream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]): Promise<string> {
        return new Promise((res, rej) => {
            const timeout = setTimeout(() => {
                console.log("Time Out Called");
                rej("TLE");
            }, 2000);
            loggerstream.on('end', () => {
                clearTimeout(timeout);
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

export default JavaExecutor;