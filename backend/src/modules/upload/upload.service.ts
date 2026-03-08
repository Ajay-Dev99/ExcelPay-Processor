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
  },
    {
      jobId: `upload - ${upload.id}`
    }

  );

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



export const getUploadStatus = async (uploadId: number, userId: number) => {

  console.log(uploadId, userId)

  const upload = await prisma.upload.findFirst({
    where: {
      id: uploadId,
      userId
    },
    select: {
      id: true,
      fileName: true,
      status: true,
      processedRows: true,
      totalRows: true,
      uploadedAt: true,
      processedAt: true
    }
  });

  if (!upload) {
    throw new Error("Upload not found");
  }

  const progress =
    upload.totalRows && upload.totalRows > 0
      ? Math.floor((upload.processedRows! / upload.totalRows) * 100)
      : 0;

  return {
    ...upload,
    progress
  };
};
