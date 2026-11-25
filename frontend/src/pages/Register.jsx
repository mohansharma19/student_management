import { useState } from "react";
import { GraduationCap, User, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";

const Register = () => {
    const registerMutation = useRegister();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [registered, setRegistered] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        registerMutation.mutate(
            {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
            },
            {
                onSuccess: (data) => {
                    setMessage(
                        data.message ||
                        "Registration successful. Please verify your email."
                    );

                    setRegistered(true);
                },
                onError: (err) => {
                    setError(
                        err.response?.data?.message ||
                        "Registration failed. Please try again."
                    );
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl grid md:grid-cols-2 overflow-hidden">

                {/* Left Section */}
                <div className="bg-blue-50 p-10 flex flex-col justify-center">

                    <div className="flex items-center gap-2 mb-10">
                        <GraduationCap size={40} className="text-blue-600" />

                        <h1 className="text-3xl font-bold text-slate-900">
                            Edu<span className="text-blue-600">Track</span>
                        </h1>
                    </div>

                    <h2 className="text-4xl font-bold text-slate-800 mb-4">
                        Join EduTrack!
                    </h2>

                    <p className="text-slate-500 mb-8">
                        Create your account and manage students,
                        attendance and academic performance easily.
                    </p>

                    <GraduationCap size={110} className="text-blue-600" />

                </div>

                {/* Right Section */}
                <div className="p-10 flex flex-col justify-center">

                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                        Create Account
                    </h2>

                    <p className="text-slate-500 mb-6">
                        Fill in your details to get started.
                    </p>

                    {/* Success Message */}
                    {message && (
                        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                            <p className="font-semibold">
                                Registration Successful!
                            </p>

                            <p className="mt-2 text-sm">
                                {message}
                            </p>

                            <p className="mt-2 text-sm">
                                Please check your inbox and spam folder
                                to verify your email address.
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {!registered && (
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Full Name */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Full Name
                                </label>

                                <div className="flex items-center border rounded-lg px-3">
                                    <User size={20} className="text-slate-400" />

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full p-3 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Email Address
                                </label>

                                <div className="flex items-center border rounded-lg px-3">
                                    <Mail size={20} className="text-slate-400" />

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
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
                                    <Lock size={20} className="text-slate-400" />

                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create password"
                                        className="w-full p-3 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Confirm Password
                                </label>

                                <div className="flex items-center border rounded-lg px-3">
                                    <Lock size={20} className="text-slate-400" />

                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                        className="w-full p-3 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={registerMutation.isPending}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {registerMutation.isPending
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>

                        </form>
                    )}

                    {registered && (
                        <Link
                            to="/login"
                            className="text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Go to Login
                        </Link>
                    )}

                    {!registered && (
                        <p className="text-center mt-5 text-slate-500">
                            Already have an account?

                            <Link
                                to="/login"
                                className="text-blue-600 font-semibold ml-1 hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Register;