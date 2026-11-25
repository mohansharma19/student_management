
import React, { useState, useEffect } from "react";
import { GraduationCap, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    
    // 
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        const updateUser = () => {
            try {
                const savedUser = localStorage.getItem("user");
                setUser(savedUser ? JSON.parse(savedUser) : null);
            } catch {
                setUser(null);
            }
        };

        window.addEventListener("authChanged", updateUser);
        window.addEventListener("storage", updateUser);

        return () => {
            window.removeEventListener("authChanged", updateUser);
            window.removeEventListener("storage", updateUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        window.dispatchEvent(new Event("authChanged"));

        navigate("/");
    };

    return (
        <nav className="flex items-center justify-between px-8 py-6 bg-white shadow-sm">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
                <GraduationCap size={48} className="text-blue-700" />

                <h1 className="text-3xl font-bold text-slate-900">
                    Edu<span className="text-blue-600">Track</span>
                </h1>
            </Link>

            {/* Navigation */}
            <ul className="flex items-center gap-10 text-lg font-medium text-slate-800">

                <li>
                    <Link to="/" className="hover:text-blue-600 transition">
                        Home
                    </Link>
                </li>

                <li>
                    <Link to="/about" className="hover:text-blue-600 transition">
                        About
                    </Link>
                </li>

                <li>
                    <Link to="/features" className="hover:text-blue-600 transition">
                        Features
                    </Link>
                </li>

                <li>
                    <Link to="/contact" className="hover:text-blue-600 transition">
                        Contact
                    </Link>
                </li>

            </ul>

            {/* Authentication */}
            <div className="flex items-center gap-4">

                {user ? (
                    <>
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 px-5 py-2 border border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50 transition font-semibold"
                        >
                            <User size={20} />
                            Profile
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="px-6 py-2 text-blue-700 border border-blue-700 rounded-lg hover:bg-blue-50 transition font-semibold"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold"
                        >
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
};

export default Navbar;
