import { useState, useEffect } from "react";
import { useUploads } from "../hooks/api/useUploads";
import { socket } from "../hooks/socket/useSocket";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UploadForm from "../components/dashboard/UploadForm";
import UploadProgress from "../components/dashboard/UploadProgress";
import UploadHistoryTable from "../components/dashboard/UploadHistoryTable";

// track each upload separately
interface UploadProgressItem {
    uploadId: number;
    processedRows: number;
    fileName?: string;
}

export default function DashboardPage() {

    const { data: uploads, refetch, isLoading } = useUploads();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // map of uploadId → progress item
    const [activeUploads, setActiveUploads] = useState<Record<number, UploadProgressItem>>({});

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        if (user?.id) {
            socket.emit("join-room", String(user.id));
        }

        socket.on("upload-progress", (data) => {
            setActiveUploads(prev => ({
                ...prev,
                [data.uploadId]: {
                    uploadId: data.uploadId,
                    processedRows: data.processedRows,
                }
            }));
        });

        socket.on("upload-completed", (data) => {
            // remove this specific upload from active
            setActiveUploads(prev => {
                const updated = { ...prev };
                delete updated[data.uploadId];
                return updated;
            });
            refetch();
        });

        socket.on("upload-failed", (data) => {
            alert("Upload processing failed. Please try again.");
            setActiveUploads(prev => {
                const updated = { ...prev };
                delete updated[data.uploadId];
                return updated;
            });
        });

        return () => {
            socket.off("upload-progress");
            socket.off("upload-completed");
            socket.off("upload-failed");
        };

    }, [user?.id]);

    const activeList = Object.values(activeUploads);

    const handleUploadStart = (uploadId: number) => {
        setActiveUploads(prev => ({
            ...prev,
            [uploadId]: {
                uploadId,
                processedRows: 0  // starts at 0 immediately
            }
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-900 text-lg">ExcelPay Processor</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-700 text-xs font-bold">
                                    {user?.email?.[0]?.toUpperCase()}
                                </span>
                            </div>
                            <span className="text-sm text-gray-600 hidden sm:block">
                                {user?.email}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>

                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-8">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Upload and process employee salary Excel files
                    </p>
                </div>

                <UploadForm
                    onUploaded={refetch}
                    onUploadStart={handleUploadStart}
                />

                {/* show one progress bar per active upload */}
                {activeList.map(item => (
                    <UploadProgress
                        key={item.uploadId}
                        uploadId={item.uploadId}
                        processedRows={item.processedRows}
                        uploads={uploads}
                    />
                ))}

                <UploadHistoryTable uploads={uploads} isLoading={isLoading} />

            </main>

        </div>
    );
}