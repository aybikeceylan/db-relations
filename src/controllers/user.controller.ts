import { sendSuccess } from "../common/helpers/api-reponse";
import { uploadImage } from "../common/helpers/upload-image";
import {
  createUser,
  getUserById,
  getUsers,
  updateUser,
} from "../services/user.service";
import { Request, Response } from "express";

export async function createUserController(req: Request, res: Response) {
  const { email, name, surname } = req.body;
  let avatarUrl: string | undefined;

  if (req.file?.buffer) {
    avatarUrl = await uploadImage(req.file.buffer);
  }
  const user = await createUser({
    email,
    name,
    surname,
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
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
  const { email, name, surname } = req.body;
  let avatarUrl: string | undefined;

  if (req.file?.buffer) {
    avatarUrl = await uploadImage(req.file.buffer);
  }
  const user = await updateUser(Number(id), {
    email,
    name,
    surname,
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
  });
  sendSuccess(res, 200, "User updated successfully", user);
}
