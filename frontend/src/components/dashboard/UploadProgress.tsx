export default function UploadProgress({ progress, processedRows }: any) {

    if (progress === null) return null;

    return (

        <div className="bg-white p-6 rounded shadow mb-6">

            <h2 className="text-lg font-semibold mb-2">
                Processing...
            </h2>

            {/* Indeterminate animated bar */}
            <div className="w-full bg-gray-200 h-4 rounded overflow-hidden">
                <div className="bg-blue-500 h-4 rounded animate-pulse w-full" />
            </div>

            <p className="mt-2 text-sm text-gray-600">
                {processedRows > 0
                    ? `${processedRows.toLocaleString()} rows processed so far...`
                    : "Starting..."}
            </p>

        </div>

    );
}