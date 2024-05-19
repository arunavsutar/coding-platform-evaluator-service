//import Docker from 'dockerode';
import createContainer from './containerFactory';
// import { testCase } from '../types/testCases';
import { PYTHON_IMAGE } from '../utils/constants';
import decodeBufferString from './dockerHelper';
import { promise } from 'zod';

async function runPython(code: string, io: string) {
    const rawLogBuffer: Buffer[] = [];
    console.log("Initialising a new Python Docker Container.");
    //       /bin/sh is used to not explicitly make it executable file using chmod.
    // We can directly run that. Just execute a bash script and -c for telling not from any file from the string.

    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${io}' | python3 test.py`;
    console.log(runCommand);
    //const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ["python3", "-c", code, 'stty -echo']);
    //Flags have to be passed Separately....
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['/bin/sh', '-c', runCommand]);
    await pythonDockerContainer.start();
    console.log("Docker Container created and Started.");

    const loggerstream = await pythonDockerContainer.logs({
        stdout: true,
        stderr: true,
        timestamps: false,
        follow: true     //whether the logs are streamed or returned as a string
    });
    // We can attach events on the stream object to start and stop reading.
    loggerstream.on('data', (chunk) => {
        rawLogBuffer.push(chunk);
    });
    await new Promise((res) => {
        loggerstream.on('end', () => {
            console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeBufferString(completeBuffer);
            console.log("stdout =");
            console.log(decodedStream.stdout);

            console.log("stderr =\n", decodedStream.stderr);
            res(decodedStream);
        });
    });
    await pythonDockerContainer.remove();
}

export default runPython;