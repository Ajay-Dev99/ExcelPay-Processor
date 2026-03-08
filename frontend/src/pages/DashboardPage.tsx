import { useState, useEffect } from "react";
import { useUploads } from "../hooks/api/useUploads";
import { socket } from "../hooks/socket/useSocket";
import UploadForm from "../components/dashboard/UploadForm";
import UploadProgress from "../components/dashboard/UploadProgress";
import UploadHistoryTable from "../components/dashboard/UploadHistoryTable";


export default function DashboardPage() {

    const { data: uploads, refetch } = useUploads();

    const [progress, setProgress] = useState<number | null>(null);

    useEffect(() => {

        socket.on("upload-progress", (data) => {

            setProgress(data.progress);

        });

        socket.on("upload-completed", () => {

            setProgress(100);

            refetch();

            setTimeout(() => setProgress(null), 3000);

        });

        socket.on("upload-failed", () => {
            console.log("failed Socket is triggered")
            alert("Upload failed");

            setProgress(null);

        });

        return () => {

            socket.off("upload-progress");
            socket.off("upload-completed");
            socket.off("upload-failed");

        };

    }, []);

    return (

        <div className="min-h-screen bg-gray-100 p-10">

            <h1 className="text-3xl font-bold mb-8">
                ExcelPay Processor Dashboard
            </h1>

            <UploadForm onUploaded={refetch} />

            <UploadProgress progress={progress} />

            <UploadHistoryTable uploads={uploads} />

        </div>

    );
}