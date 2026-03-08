import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/ui/AuthCard";
import PasswordInput from "../components/ui/PasswordInput";

export default function LoginPage() {

    const { login, loginPending } = useAuth();
    const navigate = useNavigate();

    const [values, setValues] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async () => {
        if (!values.email || !values.password) {
            setError("Please fill in all fields");
            return;
        }
        try {
            setError("");
            await login(values.email, values.password);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <AuthCard
            subtitle="Sign in to your account"
            error={error}
            isPending={loginPending}
            submitLabel="Sign In"
            pendingLabel="Signing in..."
            onSubmit={handleLogin}
            footerText="Don't have an account?"
            footerLinkText="Create one"
            footerLinkTo="/register"
        >
            {/* Email */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                </label>
                <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={values.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/* Password */}
            <PasswordInput
                name="password"
                label="Password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="mb-6"
            />
        </AuthCard>
    );
}