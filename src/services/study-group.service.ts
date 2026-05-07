import { AppError } from "../common/errors/app-error";
import { uploadImage } from "../common/helpers/upload-image";
import { prisma } from "../lib/prisma";

export type CreateStudyGroupParams = {
  name: string;
  description?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  file?: Express.Multer.File;
};
export async function createStudyGroup(input: CreateStudyGroupParams) {
  const duplicate = await prisma.studyGroup.findFirst({
    where: {
      name: input.name,
      deletedAt: null,
    },
  });
  if (duplicate) {
    throw new AppError("Study group with this name already exists", 409);
  }
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
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(avatarUrl !== undefined && avatarPublicId !== undefined
        ? { avatarUrl, avatarPublicId }
        : {}),
    },
  });
  return studyGroup;
}
