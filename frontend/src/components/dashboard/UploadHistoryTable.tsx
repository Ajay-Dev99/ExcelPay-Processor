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

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Upload History
            </h2>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Spinner text="Fetching history..." />
                </div>

            ) : !uploads || uploads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium">No uploads yet</p>
                    <p className="text-xs mt-1">Upload your first Excel file to get started</p>
                </div>

            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">File</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rows</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Uploaded</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Processed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {uploads.map((u: any) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium text-gray-800 truncate max-w-[180px]">
                                                {u.fileName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <StatusBadge status={u.status} />
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {u.processedRows != null
                                            ? u.processedRows.toLocaleString()
                                            : "—"
                                        }
                                    </td>
                                    <td className="py-3 px-4 text-gray-500 text-xs">
                                        {formatDate(u.uploadedAt)}
                                    </td>
                                    <td className="py-3 px-4 text-gray-500 text-xs">
                                        {formatDate(u.processedAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}