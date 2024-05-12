import { Request, Response } from "express";
import { CreateSubmissionDto } from "../dtos/createSubmissionDto";

export function addSubmission(req: Request, res: Response) {
    const submissionDto = req.body as CreateSubmissionDto;
    return res.status(201).json({
        success: true,
        error: {},
        message: "Message collected Successfully.",
        data: submissionDto
    });
};