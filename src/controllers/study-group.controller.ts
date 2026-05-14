import { sendSuccess } from "../common/helpers/api-reponse";
import {
  addMemberToStudyGroup,
  createStudyGroup,
  deleteStudyGroup,
  getMembersOfStudyGroup,
  getStudyGroupById,
  getStudyGroups,
  removeMemberFromStudyGroup,
  updateStudyGroup,
  updateStudyGroupAvatar,
} from "../services/study-group.service";
import { Request, Response } from "express";

export async function createStudyGroupController(req: Request, res: Response) {
  const { name, description, userId } = req.body;
  const studyGroup = await createStudyGroup({
    name,
    description,
    ...(req.file ? { file: req.file } : {}),
    userId,
  });
  sendSuccess(res, 201, "Study group created successfully", studyGroup);
}

export async function getStudyGroupsController(req: Request, res: Response) {
  const studyGroups = await getStudyGroups();
  sendSuccess(res, 200, "Study groups fetched successfully", studyGroups);
}

export async function getStudyGroupByIdController(req: Request, res: Response) {
  const { id } = req.params;
  const studyGroup = await getStudyGroupById(Number(id));
  sendSuccess(res, 200, "Study group fetched successfully", studyGroup);
}

export async function updateStudyGroupController(req: Request, res: Response) {
  const { id } = req.params;
  const { name, description, userId } = req.body;
  const studyGroup = await updateStudyGroup(Number(id), {
    name,
    description,
    userId,
  });
  sendSuccess(res, 200, "Study group updated successfully", studyGroup);
}

export async function deleteStudyGroupController(req: Request, res: Response) {
  const { id } = req.params;
  const studyGroup = await deleteStudyGroup(Number(id));
  sendSuccess(res, 200, "Study group deleted successfully", studyGroup);
}

export async function updateStudyGroupAvatarController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;
  const studyGroup = await updateStudyGroupAvatar(
    Number(id),
    req.file as Express.Multer.File,
  );
  sendSuccess(res, 200, "Study group avatar updated successfully", studyGroup);
}

export async function addMemberToStudyGroupController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;
  const { userId } = req.body;
  const studyGroup = await addMemberToStudyGroup(Number(id), Number(userId));
  sendSuccess(res, 200, "Member added to study group successfully", studyGroup);
}

export async function removeMemberFromStudyGroupController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;
  const { userId } = req.body;
  const studyGroup = await removeMemberFromStudyGroup(
    Number(id),
    Number(userId),
  );
  sendSuccess(
    res,
    200,
    "Member removed from study group successfully",
    studyGroup,
  );
}

export async function getMembersOfStudyGroupController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;
  const members = await getMembersOfStudyGroup(Number(id));
  sendSuccess(res, 200, "Members of study group fetched successfully", members);
}
