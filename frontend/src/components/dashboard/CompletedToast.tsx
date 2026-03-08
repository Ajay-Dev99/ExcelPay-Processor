import type { CompletedToastItem } from "../../hooks/socket/useSocketUploads";

interface Props {
    toast: CompletedToastItem;
    onDismiss: (uploadId: number) => void;
}

const isSuccess = (toast: CompletedToastItem) => toast.processedRows > 0;

export default function CompletedToast({ toast, onDismiss }: Props) {

    const success = isSuccess(toast);

    return (
        <div className={`rounded-2xl shadow-xl border p-4 flex items-start gap-3 bg-white ${success ? "border-green-200" : "border-red-200"}`}>

            {/* Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${success ? "bg-green-100" : "bg-red-100"}`}>
                {success ? (
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
                <p className="text-sm font-semibold text-gray-800 truncate">{toast.fileName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {success
                        ? `✓ Completed — ${toast.processedRows.toLocaleString()} rows processed`
                        : "✗ Processing failed"}
                </p>
            </div>

            {/* Dismiss */}
            <button
                onClick={() => onDismiss(toast.uploadId)}
                className="text-gray-300 hover:text-gray-500 transition shrink-0"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

        </div>
    );
}
