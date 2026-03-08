interface Props {
    user: any;
    onNewUpload: () => void;
    onLogout: () => void;
}

export default function Sidebar({ user, onNewUpload, onLogout }: Props) {
    return (
        <aside className="w-64 flex flex-col border-r border-gray-200 bg-white shrink-0 py-4">

            {/* Logo */}
            <div className="flex items-center gap-2 px-4 mb-6">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <span className="font-bold text-gray-900 text-base leading-tight">
                    ExcelPay<br />
                    <span className="text-xs font-normal text-gray-400">Processor</span>
                </span>
            </div>

            {/* New Upload Button */}
            <div className="px-3 mb-4">
                <button
                    onClick={onNewUpload}
                    className="flex items-center gap-3 w-full bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 shadow-sm text-gray-700 font-medium px-4 py-3 rounded-2xl transition"
                >
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    New Upload
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    My Uploads
                </div>

                <div
                    onClick={onLogout}
                    className="flex items-center gap-3 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-100 font-medium text-sm cursor-pointer transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </div>
            </nav>

            {/* User */}
            <div className="px-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">
                            {user?.email?.[0]?.toUpperCase()}
                        </span>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-medium text-gray-800 truncate">{user?.email}</p>
                        <p className="text-xs text-gray-400">Free account</p>
                    </div>
                </div>
            </div>

        </aside>
    );
}
