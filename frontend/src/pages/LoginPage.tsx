import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {

    const { login } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {

        try {

            await login(email, password);

            navigate("/dashboard");

        } catch (err: any) {

            setError(err.message);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded shadow w-[400px]">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Login
                </h2>

                {error && (
                    <p className="text-red-500 mb-3">{error}</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-4 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-4 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Login
                </button>

                <p className="text-sm mt-4 text-center">

                    Don't have an account?

                    <Link to="/register" className="text-blue-500 ml-1">
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );
}