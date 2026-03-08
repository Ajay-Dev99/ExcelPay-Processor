import { useState } from "react";
import { useUploadFile } from "../../hooks/api/useUploadFile";

export default function UploadForm({ onUploaded }: any) {

    const [file, setFile] = useState<File | null>(null);

    const uploadMutation = useUploadFile();

    const handleUpload = async () => {

        if (!file) {
            alert("Please select a file");
            return;
        }

        try {

            await uploadMutation.mutateAsync(file);

            setFile(null);

            onUploaded();

        } catch (err: any) {

            alert(err.message);

        }
    };

    return (

        <div className="bg-white p-6 rounded shadow mb-6">

            <h2 className="text-xl font-semibold mb-4">
                Upload Excel File
            </h2>

            <input
                type="file"
                accept=".xlsx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mb-4"
            />

            <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Upload
            </button>

        </div>

    );
}