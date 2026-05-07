import { sendSuccess } from "../common/helpers/api-reponse";
import { createStudyGroup } from "../services/study-group.service";
import { Request, Response } from "express";

export async function createStudyGroupController(req: Request, res: Response) {
  const { name, description } = req.body;
  const studyGroup = await createStudyGroup({
    name,
    description,
    ...(req.file ? { file: req.file } : {}),
  });
  sendSuccess(res, 201, "Study group created successfully", studyGroup);
}
