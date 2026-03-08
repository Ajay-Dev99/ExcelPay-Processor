interface Props {
    status: string;
}

const styles: Record<string, string> = {
    completed: "bg-green-100 text-green-700 border border-green-200",
    failed: "bg-red-100 text-red-700 border border-red-200",
    processing: "bg-yellow-100 text-yellow-700 border border-yellow-200",
};

const dots: Record<string, string> = {
    completed: "bg-green-500",
    failed: "bg-red-500",
    processing: "bg-yellow-500",
};

export default function StatusBadge({ status }: Props) {
    const style = styles[status] || "bg-gray-100 text-gray-600 border border-gray-200";
    const dot = dots[status] || "bg-gray-400";

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot} ${status === "processing" ? "animate-pulse" : ""}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
