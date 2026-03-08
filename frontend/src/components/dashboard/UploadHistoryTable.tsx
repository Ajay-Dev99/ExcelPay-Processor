import { formatDate } from "../../utils/formateDate";


export default function UploadHistoryTable({ uploads }: any) {

    return (

        <div className="bg-white p-6 rounded shadow">

            <h2 className="text-xl font-semibold mb-4">
                Upload History
            </h2>

            <table className="w-full border">

                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">File</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Uploaded</th>
                        <th className="p-2">Processed</th>
                    </tr>
                </thead>

                <tbody>
                    {uploads?.map((u: any) => (
                        <tr key={u.id} className="text-center">
                            <td className="p-2">{u.fileName}</td>
                            <td className="p-2">{u.status}</td>
                            <td className="p-2">{formatDate(u.uploadedAt)}</td>
                            <td className="p-2">{formatDate(u.processedAt)}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>

    );
}