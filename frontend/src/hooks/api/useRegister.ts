import { useMutation } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";

export const useRegister = () => {

    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {

            const res = await apiClient.post("/auth/register", data);

            return res.data;
        },
    });

};