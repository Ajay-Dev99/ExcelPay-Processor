import { prisma } from "../../config/prisma";

export const createUpload = async (
  fileName: string,
  filePath: string,
  userId: number
) => {

  const upload = await prisma.upload.create({
    data: {
      fileName,
      filePath,
      status: "processing",
      userId,
    },
  });

  return upload;
};