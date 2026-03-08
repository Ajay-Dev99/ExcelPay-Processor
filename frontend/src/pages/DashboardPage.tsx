import { useState, useEffect } from "react";
import { useUploads } from "../hooks/api/useUploads";
import { socket } from "../hooks/socket/useSocket";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UploadForm from "../components/dashboard/UploadForm";
import UploadProgress from "../components/dashboard/UploadProgress";
import UploadHistoryTable from "../components/dashboard/UploadHistoryTable";

interface UploadProgressItem {
    uploadId: number;
    processedRows: number;
}

interface CompletedToast {
    uploadId: number;
    fileName: string;
    processedRows: number;
}

export default function DashboardPage() {

    const { data: uploads, refetch, isLoading } = useUploads();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeUploads, setActiveUploads] = useState<Record<number, UploadProgressItem>>({});
    const [completedToasts, setCompletedToasts] = useState<CompletedToast[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleUploadStart = (uploadId: number) => {
        setActiveUploads(prev => ({
            ...prev,
            [uploadId]: { uploadId, processedRows: 0 }
        }));
        setShowUploadModal(false);
    };

    const dismissToast = (uploadId: number) => {
        setCompletedToasts(prev => prev.filter(t => t.uploadId !== uploadId));
    };

    useEffect(() => {
        if (user?.id) {
            socket.emit("join-room", String(user.id));
        }

        // request notification permission when dashboard loads
        if (Notification.permission === "default") {
            Notification.requestPermission();
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

            const fileName = uploads?.find((u: any) => u.id === data.uploadId)?.fileName
                || `Upload #${data.uploadId}`;

            setActiveUploads(prev => {
                const updated = { ...prev };
                delete updated[data.uploadId];
                return updated;
            });

            setCompletedToasts(prev => [
                ...prev,
                {
                    uploadId: data.uploadId,
                    fileName,
                    processedRows: data.processedRows,
                }
            ]);

            // browser notification
            if (Notification.permission === "granted" && document.visibilityState === "hidden") {
                new Notification("✅ Processing Complete!", {
                    body: `${fileName} — ${data.processedRows.toLocaleString()} rows processed`,
                    icon: "/vite.svg"
                });
            }

            setTimeout(() => dismissToast(data.uploadId), 5000);
            refetch();
        });

        socket.on("upload-failed", (data) => {

            const fileName = uploads?.find((u: any) => u.id === data.uploadId)?.fileName
                || `Upload #${data.uploadId}`;

            setActiveUploads(prev => {
                const updated = { ...prev };
                delete updated[data.uploadId];
                return updated;
            });

            setCompletedToasts(prev => [
                ...prev,
                {
                    uploadId: data.uploadId,
                    fileName,
                    processedRows: 0,
                }
            ]);

            // browser notification
            if (Notification.permission === "granted") {
                new Notification("❌ Processing Failed", {
                    body: `${fileName} could not be processed. Please try again.`,
                    icon: "/vite.svg"
                });
            }

            setTimeout(() => dismissToast(data.uploadId), 5000);
        });

        return () => {
            socket.off("upload-progress");
            socket.off("upload-completed");
            socket.off("upload-failed");
        };

    }, [user?.id, uploads]);

    const activeList = Object.values(activeUploads);

    return (
        <div className="flex h-screen bg-white overflow-hidden">

            {/* ── Sidebar ── */}
            <aside className="w-64 flex flex-col border-r border-gray-200 bg-white shrink-0 py-4">

                {/* Logo */}
                <div className="flex items-center gap-2 px-4 mb-6">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="font-bold text-gray-900 text-base leading-tight">
                        ExcelPay<br />
                        <span className="text-xs font-normal text-gray-400">Processor</span>
                    </span>
                </div>

                {/* New Upload Button */}
                <div className="px-3 mb-4">
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-3 w-full bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 shadow-sm text-gray-700 font-medium px-4 py-3 rounded-2xl transition"
                    >
                        <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        New Upload
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        My Uploads
                    </div>

                    <div
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-100 font-medium text-sm cursor-pointer transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </div>
                </nav>

                {/* User */}
                <div className="px-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">
                                {user?.email?.[0]?.toUpperCase()}
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-medium text-gray-800 truncate">{user?.email}</p>
                            <p className="text-xs text-gray-400">Free account</p>
                        </div>
                    </div>
                </div>

            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 flex flex-col overflow-hidden">

                <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
                    <h1 className="text-xl font-semibold text-gray-800">My Uploads</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {uploads?.length ?? 0} files
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-4">
                    <UploadHistoryTable uploads={uploads} isLoading={isLoading} />
                </div>

            </main>

            {/* ── Upload Modal ── */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Upload Excel File</h2>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <UploadForm
                            onUploaded={refetch}
                            onUploadStart={handleUploadStart}
                        />
                    </div>
                </div>
            )}

            {/* ── Bottom Right Toasts ── */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-80">

                {/* Active processing toasts */}
                {activeList.map(item => (
                    <UploadProgress
                        key={item.uploadId}
                        uploadId={item.uploadId}
                        processedRows={item.processedRows}
                        uploads={uploads}
                    />
                ))}

                {/* Completed / failed toasts */}
                {completedToasts.map(toast => (
                    <div
                        key={toast.uploadId}
                        className={`rounded-2xl shadow-xl border p-4 flex items-start gap-3 ${toast.processedRows > 0
                            ? "bg-white border-green-200"
                            : "bg-white border-red-200"
                            }`}
                    >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.processedRows > 0 ? "bg-green-100" : "bg-red-100"
                            }`}>
                            {toast.processedRows > 0 ? (
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                                {toast.fileName}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {toast.processedRows > 0
                                    ? `✓ Completed — ${toast.processedRows.toLocaleString()} rows processed`
                                    : "✗ Processing failed"
                                }
                            </p>
                        </div>

                        {/* Dismiss */}
                        <button
                            onClick={() => dismissToast(toast.uploadId)}
                            className="text-gray-300 hover:text-gray-500 transition shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                    </div>
                ))}

            </div>

        </div>
    );
}