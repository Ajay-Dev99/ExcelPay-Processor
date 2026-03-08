import { Link } from "react-router-dom";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Register
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-4 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-4 rounded"
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border p-2 mb-4 rounded"
                />

                <button className="w-full bg-green-500 text-white p-2 rounded">
                    Register
                </button>

                <p className="mt-4 text-center text-sm">
                    Already have an account?
                    <Link to="/" className="text-blue-500 ml-1">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}