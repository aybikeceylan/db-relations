import { AppError } from "../common/errors/app-error";
import {
  uploadImage,
  type UploadImageResult,
} from "../common/helpers/upload-image";
import { prisma } from "../lib/prisma";
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
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });
  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

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
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
}

export async function updateUser(id: number, input: UpdateUserParams) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }

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
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
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
  return prisma.user.findUnique({ where: { id } });
}

export async function softDeleteUser(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }

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
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
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
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
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
