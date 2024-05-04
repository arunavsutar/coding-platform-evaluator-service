import express from "express";
import serverConfig from "./config/server.config";

const apps = express();




apps.listen(serverConfig.PORT, () => {
    console.log(`Server started at *:${serverConfig.PORT}`);
    console.log("Helllo");
});