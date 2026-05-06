import { AppError } from "../common/errors/app-error";
import { prisma } from "../lib/prisma";

export type CreateUserParams = {
  email: string;
  name: string;
  surname: string;
  avatarUrl?: string;
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

export async function updateUser(id: number, input: CreateUserParams) {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: input,
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
}
