export default function UploadProgress({ progress }: any) {

    if (progress === null) return null;

    return (

        <div className="bg-white p-6 rounded shadow mb-6">

            <h2 className="text-lg font-semibold mb-2">
                Processing Progress
            </h2>

            <div className="w-full bg-gray-200 h-4 rounded">

                <div
                    className="bg-green-500 h-4 rounded transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />

            </div>

            <p className="mt-2 text-sm">
                {progress}% completed
            </p>

        </div>

    );
}