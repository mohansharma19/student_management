import { GraduationCap, User, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
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

                    <form className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Full Name
                            </label>

                            <div className="flex items-center border rounded-lg px-3">
                                <User size={20} className="text-slate-400" />

                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full p-3 outline-none"
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
                                    placeholder="Enter your email"
                                    className="w-full p-3 outline-none"
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
                                    placeholder="Create password"
                                    className="w-full p-3 outline-none"
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
                                    placeholder="Confirm password"
                                    className="w-full p-3 outline-none"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Register As
                            </label>

                            <select className="w-full border rounded-lg p-3 outline-none">
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Create Account
                        </button>

                    </form>

                    <p className="text-center mt-5 text-slate-500">
                        Already have an account?
                        <Link
                            to="/login"
                            className="text-blue-600 font-semibold ml-1 hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                </div>

            </div>
        </div>
    );
};

export default Register;