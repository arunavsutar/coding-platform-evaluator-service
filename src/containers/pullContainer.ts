import Docker from "dockerode";
export default function pullImage(imageName: string) {
    try {
        const docker = new Docker();
        return new Promise((res, rej) => {
            docker.pull(imageName, (err: Error, stream: NodeJS.ReadableStream) => {
                if (err) throw err;
                console.log("No error during pulling..");

                docker.modem.followProgress(stream, (err, response) => err ? rej(err) : res(response), (event) => {
                    console.log(event.status);
                })
            });
        });
    } catch (error) {
        console.log(error);

    }
}