import express from "express";
import serverConfig from "./config/server.config";
import apirouter from "./routes";

const app = express();

app.use('/api', apirouter);


app.listen(serverConfig.PORT, () => {
    console.log(`Server started at *:${serverConfig.PORT}`);
    console.log("Helllo");
});