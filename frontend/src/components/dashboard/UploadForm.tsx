import { useRef, useState } from "react";
import { useUploadFile } from "../../hooks/api/useUploadFile";
import { usePreviewFile } from "../../hooks/api/usePreviewFile";
import Spinner from "../ui/Spinner";

const MAX_SIZE_MB = 100;

const REQUIRED_FIELDS = [
    { key: "employeeId", label: "Employee ID" },
    { key: "employeeName", label: "Employee Name" },
    { key: "department", label: "Department" },
    { key: "basicPay", label: "Basic Pay" },
    { key: "variablePay", label: "Variable Pay" },
    { key: "allowance", label: "Allowance" },
    { key: "bonus", label: "Bonus" },
];

interface Props {
    onUploaded: () => void;
    onUploadStart: (uploadId: number) => void;
}

export default function UploadForm({ onUploaded, onUploadStart }: Props) {

    const [step, setStep] = useState<1 | 2>(1);
    const [file, setFile] = useState<File | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [error, setError] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);
    const previewMutation = usePreviewFile();
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

    // Step 1 → Step 2: fetch headers
    const handleNext = async () => {
        if (!file) return;
        try {
            setError("");
            const res = await previewMutation.mutateAsync(file);
            const cols: string[] = res?.data?.headers || [];
            setHeaders(cols);

            // auto map if column names match
            const autoMap: Record<string, string> = {};
            REQUIRED_FIELDS.forEach(({ key, label }) => {
                const match = cols.find(c =>
                    c.toLowerCase().replace(/\s/g, "") === label.toLowerCase().replace(/\s/g, "")
                );
                if (match) autoMap[key] = match;
            });
            setMapping(autoMap);
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Failed to read file headers.");
        }
    };

    // Step 2 → Upload
    const handleUpload = async () => {
        if (!file) return;

        // validate all fields are mapped
        const unmapped = REQUIRED_FIELDS.filter(f => !mapping[f.key]);
        if (unmapped.length > 0) {
            setError(`Please map: ${unmapped.map(f => f.label).join(", ")}`);
            return;
        }

        try {
            setError("");
            const res = await uploadMutation.mutateAsync({ file, mapping });
            const uploadId = res?.data?.uploadId;
            setFile(null);
            setStep(1);
            setMapping({});
            onUploadStart(uploadId);
            onUploaded();
        } catch (err: any) {
            setError(err.message || "Upload failed. Please try again.");
        }
    };

    return (
        <div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-5">
                <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${step === 1 ? "bg-blue-600 text-white" : "bg-green-100 text-green-700"}`}>
                    {step === 1 ? "1" : "✓"} Select File
                </div>
                <div className="flex-1 h-px bg-gray-200" />
                <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                    2 Map Columns
                </div>
            </div>

            {/* STEP 1 — File Selection */}
            {step === 1 && (
                <>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".xlsx"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) selectFile(f); }}
                    />

                    {file ? (
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
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl py-8 mb-4 transition flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="text-sm font-medium">Click to browse</span>
                            <span className="text-xs text-gray-400">Only .xlsx — max {MAX_SIZE_MB}MB</span>
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={!file || previewMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                        {previewMutation.isPending ? (
                            <><Spinner size="sm" color="white" /> Reading headers...</>
                        ) : (
                            <>Next — Map Columns <span>→</span></>
                        )}
                    </button>
                </>
            )}

            {/* STEP 2 — Column Mapping */}
            {step === 2 && (
                <>
                    <p className="text-xs text-gray-500 mb-3">
                        Map each field to the correct column from your Excel file.
                    </p>

                    <div className="space-y-2 mb-5 max-h-72 overflow-y-auto pr-1">
                        {REQUIRED_FIELDS.map(({ key, label }) => (
                            <div key={key} className="grid grid-cols-2 items-center gap-3">
                                <label className="text-sm font-medium text-gray-700">{label}</label>
                                <select
                                    value={mapping[key] || ""}
                                    onChange={(e) => setMapping(prev => ({ ...prev, [key]: e.target.value }))}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select column</option>
                                    {headers.map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {/* Back */}
                        <button
                            onClick={() => { setStep(1); setError(""); }}
                            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl transition"
                        >
                            ← Back
                        </button>

                        {/* Upload */}
                        <button
                            onClick={handleUpload}
                            disabled={uploadMutation.isPending}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                        >
                            {uploadMutation.isPending ? (
                                <><Spinner size="sm" color="white" /> Uploading...</>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Upload & Process
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}

        </div>
    );
}