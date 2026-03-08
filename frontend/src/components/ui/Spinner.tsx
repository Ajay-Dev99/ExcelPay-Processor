interface Props {
    text?: string;
    size?: "sm" | "md";
    color?: "blue" | "white";
}

export default function Spinner({ text = "Loading...", size = "md", color = "blue" }: Props) {

    const sizeClass = size === "sm" ? "w-4 h-4 border-2" : "w-5 h-5 border-4";
    const colorClass = color === "white" ? "border-white border-t-transparent" : "border-blue-500 border-t-transparent";

    return (
        <div className="flex items-center gap-2">
            <div className={`${sizeClass} ${colorClass} rounded-full animate-spin`} />
            {color !== "white" && <span className="text-sm text-gray-600">{text}</span>}
        </div>
    );
}