import { useState, useRef } from "react";
import { useUploadFile } from "../../hooks/api/useUploadFile";

export default function UploadForm({ onUploaded, onUploadStart }: any) {

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadMutation = useUploadFile();

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file");
            return;
        }
        try {
            const res = await uploadMutation.mutateAsync(file);
            const uploadId = res?.data?.uploadId; // ← get uploadId from response

            setFile(null);
            onUploaded();
            onUploadStart(uploadId); // ← pass uploadId immediately to dashboard

        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped && dropped.name.endsWith(".xlsx")) {
            setFile(dropped);
        } else {
            alert("Only .xlsx files are allowed");
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">

            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Excel File
            </h2>

            {/* Drop Zone */}
            <div
                onClick={() => !uploadMutation.isPending && inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                    ${isDragging
                        ? "border-blue-500 bg-blue-50"
                        : file
                            ? "border-green-400 bg-green-50"
                            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }
                    ${uploadMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".xlsx"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploadMutation.isPending}
                />

                {file ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-green-700">{file.name}</p>
                        <p className="text-xs text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="text-xs text-red-500 hover:underline mt-1"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                            Drag & drop your file here
                        </p>
                        <p className="text-xs text-gray-400">
                            or <span className="text-blue-500 font-medium">browse</span> to choose a file
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Only .xlsx files — max 100MB
                        </p>
                    </div>
                )}
            </div>

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={uploadMutation.isPending || !file}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
                {uploadMutation.isPending ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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