import { useState, useEffect } from "react";
import { useUploads } from "../hooks/api/useUploads";
import { socket } from "../hooks/socket/useSocket";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UploadForm from "../components/dashboard/UploadForm";
import UploadProgress from "../components/dashboard/UploadProgress";
import UploadHistoryTable from "../components/dashboard/UploadHistoryTable";

export default function DashboardPage() {

    const { data: uploads, refetch, isLoading } = useUploads();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [progress, setProgress] = useState<boolean | null>(null);
    const [processedRows, setProcessedRows] = useState(0);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {

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

            {/* Header */}
            <div className="flex items-center justify-between mb-8">

                <h1 className="text-3xl font-bold">
                    ExcelPay Processor Dashboard
                </h1>

                <div className="flex items-center gap-4">

                    <span className="text-sm text-gray-600">
                        {user?.email}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>

            </div>

            <UploadForm onUploaded={refetch} />

            <UploadProgress progress={progress} processedRows={processedRows} />

            <UploadHistoryTable uploads={uploads} isLoading={isLoading} />

        </div>

    );
}