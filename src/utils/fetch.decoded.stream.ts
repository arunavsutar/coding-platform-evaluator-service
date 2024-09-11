import decodeBufferString from "../containers/dockerHelper";

function fetchDecodedStream(loggerstream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]): Promise<string> {
    return new Promise((res, rej) => {
        const start = Date.now(); // Start time
        // let timeoutOccurred = false;
        const timeout = setTimeout(() => {
            console.log("TLE Occured");
            // timeoutOccurred = true;
            rej('TLE');

        }, 10000);
        loggerstream.on('end', () => {
            // if (!timeoutOccurred) {
            clearTimeout(timeout);
            const end = Date.now(); // End time
            const elapsed = end - start; // Calculate the time difference
            console.log(`Execution time: ${elapsed} milliseconds`);
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
            // }
            // else {
            //     console.log("End event fired after timeout occurred. Ignoring. But dont why the flow came here after rejecting the promise also.");
            // }
        });
    });
}

export default fetchDecodedStream;