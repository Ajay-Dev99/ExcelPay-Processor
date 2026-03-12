import { useMutation } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";

interface ColumnMapping {
    employeeId: string;
    employeeName: string;
    department: string;
    basicPay: string;
    variablePay: string;
    allowance: string;
    bonus: string;
}

export const useUploadFile = () => {
    return useMutation({
        mutationFn: async ({ file, mapping }: { file: File; mapping: Record<string, string> }) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("mapping", JSON.stringify(mapping));
            const res = await apiClient.post("/upload", formData);
            return res.data;
        },
    });
};