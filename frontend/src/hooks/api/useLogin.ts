import { useMutation } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";

export const useLogin = () => {

    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {

            const res = await apiClient.post("/auth/login", data);

            return res.data;
        },
    });

};