interface Props {
    uploadId: number;
    processedRows: number;
    uploads: any[];
}

export default function UploadProgress({ uploadId, processedRows, uploads }: Props) {

    const upload = uploads?.find((u: any) => u.id === uploadId);
    const fileName = upload?.fileName || `Upload #${uploadId}`;

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4">

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="text-sm font-semibold text-gray-800 truncate">
                        {fileName}
                    </span>
                </div>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0 ml-2">
                    Processing
                </span>
            </div>

            {/* Bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 animate-pulse w-full" />
            </div>

            {/* Row count */}
            <p className="mt-2 text-xs text-gray-400">
                {processedRows > 0
                    ? <><span className="text-gray-700 font-semibold">{processedRows.toLocaleString()}</span> rows processed</>
                    : "Starting..."}
            </p>

        </div>
    );
}