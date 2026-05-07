import { AppError } from "../common/errors/app-error";
import {
  uploadImage,
  type UploadImageResult,
} from "../common/helpers/upload-image";
import { prisma } from "../lib/prisma";
import { assertNoDuplicate } from "../utils/assertNoDuplicate";
import { findOneItem } from "../utils/findOneItem";
import { removeFile } from "./file.service";

export type CreateUserParams = {
  email: string;
  name: string;
  surname: string;
  avatarUrl?: string;
  avatarPublicId?: string;
};

export type UpdateUserParams = {
  email?: string;
  name?: string;
  surname?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
};

export async function createUser(input: CreateUserParams) {
  await assertNoDuplicate(
    prisma.user,
    { email: input.email },
    "User with this email already exists",
  );

  const user = await prisma.user.create({
    data: input,
  });

  return user;
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return users;
}

export async function getUserById(id: number) {
  if (Number.isNaN(id)) {
    throw new AppError("Invalid user ID", 400);
  }
  return findOneItem(prisma.user, id, "User not found");
}

export async function updateUser(id: number, input: UpdateUserParams) {
  const user = await findOneItem(prisma.user, id, "User not found");

  if (input.avatarUrl !== undefined) {
    const oldRef = user.avatarPublicId ?? user.avatarUrl;
    if (oldRef) {
      try {
        await removeFile(oldRef);
      } catch {
        throw new AppError("Failed to remove old avatar", 400);
      }
    }
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: input,
  });
}

export async function updateUserAvatar(id: number, file: Express.Multer.File) {
  const user = await findOneItem(prisma.user, id, "User not found");
  let upload: UploadImageResult;
  try {
    upload = await uploadImage(file.buffer);
  } catch {
    throw new AppError("Failed to upload avatar", 400);
  }

  const oldRef = user.avatarPublicId ?? user.avatarUrl;
  if (oldRef) {
    try {
      await removeFile(oldRef);
    } catch {
      throw new AppError("Failed to remove old avatar", 400);
    }
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      avatarUrl: upload.secureUrl,
      avatarPublicId: upload.publicId,
    },
  });
  return findOneItem(prisma.user, id, "User not found");
}

export async function softDeleteUser(id: number) {
  await findOneItem(prisma.user, id, "User not found");

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}
export async function hardDeleteUser(id: number) {
  const user = await findOneItem(prisma.user, id, "User not found");
  const avatarRef = user.avatarPublicId ?? user.avatarUrl;
  if (avatarRef) {
    await removeFile(avatarRef);
  }
  await prisma.user.delete({
    where: {
      id,
    },
  });
  return null;
}

export async function deleteUserAvatar(id: number) {
  const user = await findOneItem(prisma.user, id, "User not found");
  const avatarRef = user.avatarPublicId ?? user.avatarUrl;
  if (!avatarRef) {
    throw new AppError("User does not have an avatar", 400);
  }
  await removeFile(avatarRef);

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      avatarUrl: null,
      avatarPublicId: null,
    },
  });
  return null;
}

export async function restoreUser(id: number) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      deletedAt: null,
    },
  });
}

export async function softDeletedUsers() {
  return prisma.user.findMany({
    where: {
      deletedAt: {
        not: null,
      },
    },
    orderBy: {
      deletedAt: "desc",
    },
  });
}
