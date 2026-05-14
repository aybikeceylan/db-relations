import { uploadImage } from "../common/helpers/upload-image";
import { GroupRole } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { assertNoDuplicate } from "../utils/assertNoDuplicate";
import { findOneItem } from "../utils/findOneItem";

export type CreateStudyGroupParams = {
  name: string;
  description?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  file?: Express.Multer.File;
  userId: number;
};

export type UpdateStudyGroupParams = {
  name?: string;
  description?: string;
  userId: number;
};

/**
 * Creates a study group and adds the creator as admin.
 *
 * Preconditions: {@link CreateStudyGroupParams.userId} must refer to an existing user.
 *
 * @param input - Name, optional media, and the creator's user id
 * @returns The created study group
 */
export async function createStudyGroup(input: CreateStudyGroupParams) {
  return prisma.$transaction(async (tx) => {
    let avatarUrl: string | undefined;
    let avatarPublicId: string | undefined;
    if (input.file?.buffer) {
      const uploaded = await uploadImage(input.file.buffer);
      avatarUrl = uploaded.secureUrl;
      avatarPublicId = uploaded.publicId;
    }
    const studyGroup = await prisma.studyGroup.create({
      data: {
        name: input.name,
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(avatarUrl !== undefined && avatarPublicId !== undefined
          ? { avatarUrl, avatarPublicId }
          : {}),
      },
    });

    await findOneItem(prisma.user, input.userId, "User not found");

    await tx.groupMember.create({
      data: {
        userId: input.userId,
        studyGroupId: studyGroup.id,
        role: GroupRole.ADMIN,
      },
    });
    return studyGroup;
  });
}

export async function getStudyGroups() {
  return prisma.studyGroup.findMany();
}

export async function getStudyGroupById(id: number) {
  return findOneItem(prisma.studyGroup, id, "Study group not found");
}

export async function updateStudyGroup(
  id: number,
  input: UpdateStudyGroupParams,
) {
  await findOneItem(prisma.studyGroup, id, "Study group not found");
  return prisma.studyGroup.update({
    where: { id },
    data: input,
  });
}

export async function deleteStudyGroup(id: number) {
  return prisma.studyGroup.delete({
    where: { id },
  });
}

export async function updateStudyGroupAvatar(
  id: number,
  file: Express.Multer.File,
) {
  await findOneItem(prisma.studyGroup, id, "Study group not found");
  let avatarUrl: string | undefined;
  let avatarPublicId: string | undefined;
  if (file.buffer) {
    const uploaded = await uploadImage(file.buffer);
    avatarUrl = uploaded.secureUrl;
    avatarPublicId = uploaded.publicId;
  }
  return prisma.studyGroup.update({
    where: { id },
    data: {
      ...(avatarUrl !== undefined && avatarPublicId !== undefined
        ? { avatarUrl, avatarPublicId }
        : {}),
    },
  });
}

export async function addMemberToStudyGroup(
  studyGroupId: number,
  userId: number,
) {
  await findOneItem(prisma.studyGroup, studyGroupId, "Study group not found");

  await assertNoDuplicate(
    prisma.groupMember,
    {
      userId_studyGroupId: {
        userId,
        studyGroupId,
      },
    },
    "User already in study group",
  );

  return prisma.groupMember.create({
    data: {
      studyGroupId,
      userId,
      role: GroupRole.MEMBER,
    },
  });
}

export async function removeMemberFromStudyGroup(
  studyGroupId: number,
  userId: number,
) {
  await findOneItem(prisma.studyGroup, studyGroupId, "Study group not found");
  await findOneItem(prisma.user, userId, "User not found");
  return prisma.groupMember.delete({
    where: { userId_studyGroupId: { userId, studyGroupId } },
  });
}

export async function getMembersOfStudyGroup(studyGroupId: number) {
  await findOneItem(prisma.studyGroup, studyGroupId, "Study group not found");
  return prisma.groupMember.findMany({
    where: { studyGroupId },
  });
}
