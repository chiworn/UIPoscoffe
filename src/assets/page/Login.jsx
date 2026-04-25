    import { useState } from "react";
    import { LogIn, AlertCircle } from "lucide-react";
    import axios from "axios";
    import api from "../../api/axios";
    import Swal from "sweetalert2";
    import { useNavigate } from "react-router-dom";

    export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!email || !password) {
        setError("Please fill in all fields");
        return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address");
        return;
        }

        if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
        }

        setIsLoading(true);

        try {
        const response = await api.post("/login", {
            email,
            password,
        });

        //   Assume response.data = { token: "JWT_TOKEN", user: {...} }
        const { Message, data } = response.data;
        const { id, name, email: userEmail, token } = data; // token is inside data

        console.log("Token:", token);
        console.log("User:", data);
        if (token) {
            // Save JWT token to localStorage
            localStorage.setItem("ID", id);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(data.name));

            // Token will be automatically picked up by api interceptor

            // SweetAlert success
            await Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: `Welcome back, ${data.name || "User"}!`,
            timer: 1500,
            showConfirmButton: false,
            });

            // Redirect to dashboard
            navigate("/POS");
        } else {
            setError("Invalid login response");
        }
        } catch (err) {
        console.error(err);
        setError(err.response?.data?.Message || "Login failed");
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: err.response?.data?.Message || "Please check your credentials",
        });
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Login Card */}
        <div className="relative w-full max-w-md">
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary bg-amber-900 to-accent p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground rounded-xl mb-4">
                <LogIn className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">POS Login</h1>
                <p className="text-white text-sm">Point of Sale System</p>
            </div>

            {/* Form */}
            <div className="p-8">
                {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-700 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                    Email Address
                    </label>
                    <input
                    type="email"
                    placeholder="staff@pos-system.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                    Password
                    </label>
                    <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-primary  bg-amber-900 to-accent text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin " />
                        Logging in...
                    </>
                    ) : (
                    <>
                        <LogIn className="w-5 h-5 text-white" />
                        Sign In
                    </>
                    )}
                </button>
                </form>

                {/* Demo info */}
                <div className="mt-3 pt-6 border-t text-xs text-center">
                        <p>Demo Credentials</p>
                        <p>Email: demo@pos.com</p>
                        <p>Password: demo123</p>
                        <p className="text-center text-sm mt-4">
                    Don't have an account?{" "}
                    <span
                        className="text-amber-900 cursor-pointer"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>
                    </p>
                </div>
            </div>
            </div>

            <p className="text-center text-xs mt-6">Secure POS System © 2026</p>
        </div>
        </div>
    );
    }
