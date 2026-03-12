import { useState } from "react";
import UploadForm from "./UploadForm";

interface Props {
    open: boolean;
    onClose: () => void;
    onUploaded: () => void;
    onUploadStart: (uploadId: number) => void;
}

export default function UploadModal({ open, onClose, onUploaded, onUploadStart }: Props) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Upload Excel File</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <UploadForm
                    onUploaded={onUploaded}
                    onUploadStart={onUploadStart}
                />

            </div>
        </div>
    );
}