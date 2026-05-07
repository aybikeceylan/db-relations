import { sendSuccess } from "../common/helpers/api-reponse";
import { uploadImage } from "../common/helpers/upload-image";
import {
  createUser,
  deleteUserAvatar,
  getUserById,
  getUsers,
  hardDeleteUser,
  restoreUser,
  softDeletedUsers,
  softDeleteUser,
  updateUser,
  updateUserAvatar,
  type UpdateUserParams,
} from "../services/user.service";
import { Request, Response } from "express";

export async function createUserController(req: Request, res: Response) {
  const { email, name, surname } = req.body;

  let avatarUrl: string | undefined;
  let avatarPublicId: string | undefined;
  if (req.file?.buffer) {
    const uploaded = await uploadImage(req.file.buffer);
    avatarUrl = uploaded.secureUrl;
    avatarPublicId = uploaded.publicId;
  }

  const user = await createUser({
    email,
    name,
    surname,
    ...(avatarUrl !== undefined && avatarPublicId !== undefined
      ? { avatarUrl, avatarPublicId }
      : {}),
  });

  sendSuccess(res, 201, "User created successfully", user);
}

export async function getUsersController(req: Request, res: Response) {
  const users = await getUsers();
  sendSuccess(res, 200, "Users fetched successfully", users);
}

export async function getUserByIdController(req: Request, res: Response) {
  const { id } = req.params;
  const user = await getUserById(Number(id));
  sendSuccess(res, 200, "User fetched successfully", user);
}

export async function updateUserController(req: Request, res: Response) {
  const { id } = req.params;
  const payload: UpdateUserParams = { ...req.body };

  if (req.file?.buffer) {
    const uploaded = await uploadImage(req.file.buffer);
    payload.avatarUrl = uploaded.secureUrl;
    payload.avatarPublicId = uploaded.publicId;
  }

  const user = await updateUser(Number(id), payload);
  sendSuccess(res, 200, "User updated successfully", user);
}

export async function updateUserAvatarController(req: Request, res: Response) {
  const { id } = req.params;
  const user = await updateUserAvatar(
    Number(id),
    req.file as Express.Multer.File,
  );
  sendSuccess(res, 200, "User avatar updated successfully", user);
}

export async function deleteUserController(req: Request, res: Response) {
  const { id } = req.params;
  await softDeleteUser(Number(id));
  sendSuccess(res, 200, "User soft deleted successfully");
}

export async function hardDeleteUserController(req: Request, res: Response) {
  const { id } = req.params;
  await hardDeleteUser(Number(id));
  sendSuccess(res, 200, "User permanently deleted");
}

export async function deleteUserAvatarController(req: Request, res: Response) {
  const { id } = req.params;
  await deleteUserAvatar(Number(id));
  sendSuccess(res, 200, "User avatar deleted successfully");
}

export async function restoreUserController(req: Request, res: Response) {
  const { id } = req.params;
  await restoreUser(Number(id));
  sendSuccess(res, 200, "User restored successfully");
}

export async function softDeletedUsersController(req: Request, res: Response) {
  const users = await softDeletedUsers();
  sendSuccess(res, 200, "Soft deleted users fetched successfully", users);
}
