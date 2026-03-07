import { prisma } from "../../config/prisma";
import { uploadQueue } from "../../queue/upload.queue";

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

  await uploadQueue.add("process-excel", {
    uploadId: upload.id,
    filePath: filePath,
  });

  return upload;
};


export const getUploadHistory = async (userId: number) => {

  const uploads = await prisma.upload.findMany({
    where: {
      userId
    },
    orderBy: {
      uploadedAt: "desc"
    },
    select: {
      id: true,
      fileName: true,
      status: true,
      totalRows: true,
      processedRows: true,
      uploadedAt: true,
      processedAt: true,
      userId: true,
      filePath: true
    }
  });

  return uploads;

};