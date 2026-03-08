import { useRef, useState } from "react";
import { useUploadFile } from "../../hooks/api/useUploadFile";
import Spinner from "../ui/Spinner";

const MAX_SIZE_MB = 100;

interface Props {
    onUploaded: () => void;
    onUploadStart: (uploadId: number) => void;
}

export default function UploadForm({ onUploaded, onUploadStart }: Props) {

    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const uploadMutation = useUploadFile();

    const validate = (f: File): string => {
        if (!f.name.toLowerCase().endsWith(".xlsx")) return "Only .xlsx files are allowed.";
        if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File must be under ${MAX_SIZE_MB}MB.`;
        return "";
    };

    const selectFile = (f: File) => {
        const err = validate(f);
        if (err) { setError(err); return; }
        setError("");
        setFile(f);
    };

    const handleUpload = async () => {
        if (!file) return;
        try {
            setError("");
            const res = await uploadMutation.mutateAsync(file);
            const uploadId = res?.data?.uploadId;
            setFile(null);
            onUploadStart(uploadId);
            onUploaded();
        } catch (err: any) {
            setError(err.message || "Upload failed. Please try again.");
        }
    };

    return (
        <div>

           
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {/* File picker */}
            <input
                ref={inputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) selectFile(f); }}
                disabled={uploadMutation.isPending}
            />

            {file ? (
                /* Selected file preview */
                <div className="flex items-center gap-3 border border-green-200 bg-green-50 rounded-xl px-4 py-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                        onClick={() => { setFile(null); setError(""); }}
                        className="text-gray-400 hover:text-red-500 transition shrink-0"
                        disabled={uploadMutation.isPending}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                /* Browse button */
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                    className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl py-8 mb-4 transition flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="text-sm font-medium">Click to browse</span>
                    <span className="text-xs text-gray-400">Only .xlsx — max {MAX_SIZE_MB}MB</span>
                </button>
            )}

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={uploadMutation.isPending || !file}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
                {uploadMutation.isPending ? (
                    <>
                        <Spinner size="sm" color="white" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload File
                    </>
                )}
            </button>

        </div>
    );
}