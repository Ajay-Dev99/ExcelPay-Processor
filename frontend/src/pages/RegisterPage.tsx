import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/ui/AuthCard";
import PasswordInput from "../components/ui/PasswordInput";

export default function RegisterPage() {

    const { register, registerPending } = useAuth();
    const navigate = useNavigate();

    const [values, setValues] = useState({ email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegister = async () => {
        if (!values.email || !values.password || !values.confirmPassword) {
            setError("Please fill in all fields");
            return;
        }
        if (values.password !== values.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (values.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        try {
            setError("");
            await register(values.email, values.password);
            navigate("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleRegister();
    };

    return (
        <AuthCard
            subtitle="Create your account"
            error={error}
            isPending={registerPending}
            submitLabel="Create Account"
            pendingLabel="Creating account..."
            onSubmit={handleRegister}
            footerText="Already have an account?"
            footerLinkText="Sign in"
            footerLinkTo="/"
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
                placeholder="Min. 6 characters"
                value={values.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />

            {/* Confirm Password */}
            <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter password"
                value={values.confirmPassword}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="mb-6"
            />
        </AuthCard>
    );
}