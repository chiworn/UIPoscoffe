import { useState } from "react";
import { UserPlus, AlertCircle } from "lucide-react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name || !email || !password) {
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
      const response = await api.post("/register", {
        name,
        email,
        password,
      });

      const { Message } = response.data;

      await Swal.fire({
        icon: "success",
        title: "Register Successful",
        text: Message || "Account created successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      // redirect to login after register
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.Message || "Register failed");

      Swal.fire({
        icon: "error",
        title: "Register Failed",
        text:
          err.response?.data?.Message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-amber-900 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16  rounded-xl mb-4">
              <UserPlus className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Register Account</h1>
            <p className="text-white text-sm pt-2">Create your account</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-700 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-amber-900 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Sign Up
                  </>
                )}
              </button>
            </form>

            {/* Link to login */}
              <div className="mt-3 pt-6 border-t text-xs text-center">
                        <p>Demo Credentials</p>
                        <p>Email: demo@pos.com</p>
                        <p>Password: demo123</p>
                         <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <span
                className="text-amber-900 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Login
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