import { useQuery } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";

export const useUploads = () => {

    return useQuery({
        queryKey: ["uploads"],
        queryFn: async () => {

            const res = await apiClient.get("/upload");
            return res?.data?.data?.uploads;
        },
    });

};