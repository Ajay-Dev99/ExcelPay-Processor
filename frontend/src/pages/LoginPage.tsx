import { Link } from "react-router-dom";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Login
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

                <button className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>

                <p className="mt-4 text-center text-sm">
                    Don't have an account?
                    <Link to="/register" className="text-blue-500 ml-1">
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}