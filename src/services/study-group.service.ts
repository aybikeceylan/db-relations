import { uploadImage } from "../common/helpers/upload-image";
import { GroupRole } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { findOneItem } from "../utils/findOneItem";

export type CreateStudyGroupParams = {
  name: string;
  description?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  file?: Express.Multer.File;
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
