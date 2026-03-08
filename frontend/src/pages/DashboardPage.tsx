import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUploads } from "../hooks/api/useUploads";
import { useAuth } from "../context/AuthContext";
import { useSocketUploads } from "../hooks/socket/useSocketUploads";
import Sidebar from "../components/dashboard/Sidebar";
import UploadModal from "../components/dashboard/UploadModal";
import UploadHistoryTable from "../components/dashboard/UploadHistoryTable";
import UploadProgress from "../components/dashboard/UploadProgress";
import CompletedToast from "../components/dashboard/CompletedToast";

export default function DashboardPage() {

    const { data: uploads, refetch, isLoading } = useUploads();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [showUploadModal, setShowUploadModal] = useState(false);

    const { activeList, completedToasts, dismissToast, startUpload } = useSocketUploads({
        userId: user?.id,
        uploads,
        onCompleted: refetch,
    });

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleUploadStart = (uploadId: number) => {
        startUpload(uploadId);
        setShowUploadModal(false);
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">

            <Sidebar
                user={user}
                onNewUpload={() => setShowUploadModal(true)}
                onLogout={handleLogout}
            />

            {/* Main Content */}
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

            <UploadModal
                open={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUploaded={refetch}
                onUploadStart={handleUploadStart}
            />

            {/* Bottom-right toast stack */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-80">

                {activeList.map(item => (
                    <UploadProgress
                        key={item.uploadId}
                        uploadId={item.uploadId}
                        processedRows={item.processedRows}
                        uploads={uploads}
                    />
                ))}

                {completedToasts.map(toast => (
                    <CompletedToast
                        key={toast.uploadId}
                        toast={toast}
                        onDismiss={dismissToast}
                    />
                ))}

            </div>

        </div>
    );
}