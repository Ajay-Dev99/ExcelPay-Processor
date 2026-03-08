export default function Spinner({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">{text}</span>
        </div>
    );
}