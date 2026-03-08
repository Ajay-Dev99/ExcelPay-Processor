interface Props {
    subtitle: string;
}

export default function AuthLogo({ subtitle }: Props) {
    return (
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ExcelPay Processor</h1>
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
    );
}
