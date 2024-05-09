import express from "express";
import { pingCheck } from "../../controller/pingController";

const v1router = express.Router();
v1router.get("/ping", pingCheck);


export default v1router;