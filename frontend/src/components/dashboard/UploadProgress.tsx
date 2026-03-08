interface Props {
    uploadId: number;
    processedRows: number;
    uploads: any[];
}

export default function UploadProgress({ uploadId, processedRows, uploads }: Props) {

    // find filename from upload history
    const upload = uploads?.find((u: any) => u.id === uploadId);
    const fileName = upload?.fileName || `Upload #${uploadId}`;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 mb-4">

            <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="truncate max-w-xs">{fileName}</span>
                </h2>
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full shrink-0">
                    In Progress
                </span>
            </div>

            {/* Animated bar */}
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse w-full" />
            </div>

            <p className="mt-3 text-sm text-gray-500">
                {processedRows > 0 ? (
                    <>
                        <span className="text-gray-900 font-semibold">
                            {processedRows.toLocaleString()}
                        </span> rows processed so far...
                    </>
                ) : (
                    "Starting — please wait..."
                )}
            </p>

        </div>
    );
}