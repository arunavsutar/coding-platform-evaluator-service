import express from "express";
import { pingCheck } from "../../controller/pingController";
import submissionRouter from "./submissionRoute";

const v1router = express.Router();
v1router.get("/ping", pingCheck);
v1router.use("/submission", submissionRouter);


export default v1router;