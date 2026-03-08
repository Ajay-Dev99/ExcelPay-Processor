import { useState, useEffect } from "react";
import { useUploads } from "../hooks/api/useUploads";
import { socket } from "../hooks/socket/useSocket";
import { useAuth } from "../context/AuthContext";
import UploadForm from "../components/dashboard/UploadForm";
import UploadProgress from "../components/dashboard/UploadProgress";
import UploadHistoryTable from "../components/dashboard/UploadHistoryTable";

export default function DashboardPage() {

    const { data: uploads, refetch } = useUploads();
    const { user } = useAuth();

    const [progress, setProgress] = useState<boolean | null>(null);
    const [processedRows, setProcessedRows] = useState(0);

    useEffect(() => {

        // join user-specific room so only this user gets their events
        if (user?.id) {
            socket.emit("join-room", String(user.id));
        }

        socket.on("upload-progress", (data) => {
            setProgress(true);
            setProcessedRows(data.processedRows);
        });

        socket.on("upload-completed", () => {
            setProgress(null);
            setProcessedRows(0);
            refetch();
        });

        socket.on("upload-failed", () => {
            console.log("failed Socket is triggered");
            alert("Upload failed");
            setProgress(null);
            setProcessedRows(0);
        });

        return () => {
            socket.off("upload-progress");
            socket.off("upload-completed");
            socket.off("upload-failed");
        };

    }, [user?.id]);

    return (

        <div className="min-h-screen bg-gray-100 p-10">

            <h1 className="text-3xl font-bold mb-8">
                ExcelPay Processor Dashboard
            </h1>

            <UploadForm onUploaded={refetch} />

            <UploadProgress progress={progress} processedRows={processedRows} />

            <UploadHistoryTable uploads={uploads} />

        </div>

    );
}