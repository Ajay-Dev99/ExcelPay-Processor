import AuthLogo from "./AuthLogo";
import { Link } from "react-router-dom";

interface Props {
    subtitle: string;
    error: string;
    isPending: boolean;
    submitLabel: string;
    pendingLabel: string;
    onSubmit: () => void;
    footerText: string;
    footerLinkText: string;
    footerLinkTo: string;
    children: React.ReactNode;
}

export default function AuthCard({
    subtitle,
    error,
    isPending,
    submitLabel,
    pendingLabel,
    onSubmit,
    footerText,
    footerLinkText,
    footerLinkTo,
    children,
}: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

                <AuthLogo subtitle={subtitle} />

                
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

              
                {children}

                
                <button
                    onClick={onSubmit}
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {pendingLabel}
                        </>
                    ) : submitLabel}
                </button>

                
                <p className="text-center text-sm text-gray-500 mt-6">
                    {footerText}{" "}
                    <Link to={footerLinkTo} className="text-blue-600 font-medium hover:underline">
                        {footerLinkText}
                    </Link>
                </p>

            </div>
        </div>
    );
}
