import { GraduationCap, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
const Login = () => {
    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl grid md:grid-cols-2 overflow-hidden">

                {/* Left Section */}
                <div className="p-10 flex flex-col justify-center">

                    <div className="flex items-center gap-2 mb-12">
                        <GraduationCap size={40} className="text-blue-600" />
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

                    <form className="space-y-5">

                        <div>
                            <label className="block mb-2 font-medium">
                                Email Address
                            </label>

                            <div className="flex items-center border rounded-lg px-3">
                                <Mail className="text-slate-400" size={20} />

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full p-3 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">
                                Password
                            </label>

                            <div className="flex items-center border rounded-lg px-3">
                                <Lock className="text-slate-400" size={20} />

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full p-3 outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Login
                        </button>

                    </form>

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