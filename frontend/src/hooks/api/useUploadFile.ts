import { useMutation } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";

export const useUploadFile = () => {

    return useMutation({
        mutationFn: async (file: File) => {

            const formData = new FormData();

            formData.append("file", file);

            const res = await apiClient.post("/upload", formData);

            return res.data;
        },
    });

};