export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-100 p-10">

            <h1 className="text-3xl font-bold mb-8">
                ExcelPay Processor Dashboard
            </h1>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded shadow mb-6">

                <h2 className="text-xl font-semibold mb-4">
                    Upload Excel File
                </h2>

                <input type="file" className="mb-4" />

                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Upload
                </button>

            </div>

            {/* Processing Status */}
            <div className="bg-white p-6 rounded shadow mb-6">

                <h2 className="text-xl font-semibold mb-4">
                    Processing Status
                </h2>

                <div className="w-full bg-gray-200 rounded h-4">
                    <div className="bg-green-500 h-4 w-1/3 rounded"></div>
                </div>

            </div>

            {/* Upload History */}
            <div className="bg-white p-6 rounded shadow">

                <h2 className="text-xl font-semibold mb-4">
                    Upload History
                </h2>

                <table className="w-full border">

                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">File Name</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Uploaded At</th>
                            <th className="p-2">Processed At</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="text-center">
                            <td className="p-2">employees.xlsx</td>
                            <td className="p-2">Completed</td>
                            <td className="p-2">2026-01-01</td>
                            <td className="p-2">2026-01-01</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </div>
    );
}