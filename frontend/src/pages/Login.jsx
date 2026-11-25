
import { useState } from "react";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const loginMutation = useLogin();

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage("");

        if (!email.trim() || !password) {
            setMessage("Please enter email and password");
            return;
        }

        loginMutation.mutate(
            {
                email: email.trim(),
                password,
            },
            {
                onSuccess: (data) => {
                    console.log("Login Response:", data);

                    // Check backend response
                    if (!data?.token || !data?.user) {
                        console.error("Token or User missing:", data);
                        setMessage("Invalid login response from server.");
                        return;
                    }

                    // Save JWT Token
                    localStorage.setItem("token", data.token);

                    // Save User Details
                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );

                    // Update Navbar and Sidebar
                    window.dispatchEvent(
                        new Event("authChanged")
                    );

                    // Redirect to Home Page
                    navigate("/", { replace: true });
                },

                onError: (error) => {
                    console.error(
                        "Login Error:",
                        error.response?.data || error
                    );

                    setMessage(
                        error.response?.data?.message ||
                        "Login failed. Please try again."
                    );
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl grid md:grid-cols-2 overflow-hidden">

                {/* Left Section */}
                <div className="p-10 flex flex-col justify-center">

                    <div className="flex items-center gap-2 mb-12">
                        <GraduationCap
                            size={40}
                            className="text-blue-600"
                        />

                        <h1 className="text-3xl font-bold">
                            Edu<span className="text-blue-600">Track</span>
                        </h1>
                    </div>

                    <h2 className="text-4xl font-bold text-slate-800 mb-4">
                        Welcome Back!
                    </h2>

                    <p className="text-slate-500 mb-8">
                        Manage your students, attendance and academic
                        performance in one place.
                    </p>

                    <div className="text-blue-600 text-7xl">
                        <GraduationCap size={100} />
                    </div>

                </div>

                {/* Right Section */}
                <div className="p-10 flex flex-col justify-center bg-white">

                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                        Sign In
                    </h2>

                    <p className="text-slate-500 mb-8">
                        Enter your details to access your account.
                    </p>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >

                        {/* Email */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Email Address
                            </label>

                            <div className="flex items-center border rounded-lg px-3">
                                <Mail
                                    className="text-slate-400"
                                    size={20}
                                />

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    className="w-full p-3 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Password
                            </label>

                            <div className="flex items-center border rounded-lg px-3">
                                <Lock
                                    className="text-slate-400"
                                    size={20}
                                />

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full p-3 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {message && (
                            <div className="p-3 rounded-lg text-sm bg-red-50 text-red-600">
                                {message}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {loginMutation.isPending
                                ? "Please wait..."
                                : "Login"}
                        </button>

                    </form>

                    {/* Register Link */}
                    <p className="text-center mt-6 text-slate-500">
                        Don't have an account?

                        <Link
                            to="/register"
                            className="text-blue-600 font-semibold ml-1 hover:underline"
                        >
                            Register
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;
