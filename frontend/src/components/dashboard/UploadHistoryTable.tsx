import { formatDate } from "../../utils/formateDate";
import Spinner from "../ui/Spinner";

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        completed: "bg-green-100 text-green-700 border border-green-200",
        failed: "bg-red-100 text-red-700 border border-red-200",
        processing: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    };
    const dots: Record<string, string> = {
        completed: "bg-green-500",
        failed: "bg-red-500",
        processing: "bg-yellow-500",
    };
    const style = styles[status] || "bg-gray-100 text-gray-600 border border-gray-200";
    const dot = dots[status] || "bg-gray-400";

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot} ${status === "processing" ? "animate-pulse" : ""}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default function UploadHistoryTable({ uploads, isLoading }: any) {

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner text="Loading uploads..." />
            </div>
        );
    }

    if (!uploads || uploads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-base font-medium text-gray-500">No uploads yet</p>
                <p className="text-sm mt-1">Click <span className="font-semibold text-gray-600">+ New Upload</span> to get started</p>
            </div>
        );
    }

    return (
        <div>
            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <div className="col-span-5">File</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Rows</div>
                <div className="col-span-2 text-right">Uploaded</div>
                <div className="col-span-2 text-right">Processed</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
                {uploads.map((u: any) => (
                    <div
                        key={u.id}
                        className="grid grid-cols-12 px-4 py-3 items-center hover:bg-gray-50 rounded-xl transition group"
                    >
                        {/* File name */}
                        <div className="col-span-5 flex items-center gap-3">
                            <div className="w-9 h-9 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center shrink-0 transition">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-800 truncate">
                                {u.fileName}
                            </span>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                            <StatusBadge status={u.status} />
                        </div>

                        {/* Rows */}
                        <div className="col-span-1 text-right text-sm text-gray-500">
                            {u.processedRows != null ? u.processedRows.toLocaleString() : "—"}
                        </div>

                        {/* Uploaded at */}
                        <div className="col-span-2 text-right text-xs text-gray-400">
                            {formatDate(u.uploadedAt)}
                        </div>

                        {/* Processed at */}
                        <div className="col-span-2 text-right text-xs text-gray-400">
                            {formatDate(u.processedAt)}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}