import Docker from 'dockerode';

async function createContainer(imageName: string, cmdExecutable: string[]) {
    const docker = new Docker();
    const container = await docker.createContainer({
        Image: imageName,
        Cmd: cmdExecutable,
        AttachStdin: true,//to enable input stream
        AttachStdout: true,//to enable output stream
        AttachStderr: true,//to enable error stream
        Tty: false,
        HostConfig: {
            Memory: 1024 * 1024 * 256 //256MB   And to check MLE
        },
        OpenStdin: true,//to keep the input stream Open even no interaction is there.
    })

    return container;
}

export default createContainer;