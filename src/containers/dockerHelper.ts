import DockerStreamOutput from "../types/dockerStream.output";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";


export default function decodeBufferString(buffer: Buffer): DockerStreamOutput {
    let offset = 0;
    const output: DockerStreamOutput = { stdout: "", stderr: "" };

    //Here the Buffer we are getting is the concatination of all the chunks array.
    //And Here we are looping over all the Buffer_chunks.
    while (offset < buffer.length) {
        const typeOfStream = buffer[offset];

        //We will read this variable on an offset of 4 bytes from the start of stream after the channel.
        const length = buffer.readUInt32BE(offset + 4);

        //To read Data we have to move the offset to end of header.
        offset += DOCKER_STREAM_HEADER_SIZE;

        if (typeOfStream === 1) {
            //stdout
            output.stdout += buffer.toString('utf-8', offset, offset + length);
        }
        else if (typeOfStream === 2) {
            //stderr
            output.stderr += buffer.toString('utf-8', offset, offset + length);
        }
        offset += length;
    }
    return output;
}