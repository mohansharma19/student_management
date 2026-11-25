
import React, { useState } from "react";

import {
    LayoutDashboard,
    User,
    CalendarCheck,
    LogOut,
    GraduationCap,
    Menu,
    X,
    FileText
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const menuItems = [
        {
            name: "Dashboard",
            path: user?.role === "admin"
                ? "/admin-dashboard"
                : "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Students",
            path: "/students",
            icon: User,
        },
        {
            name: "Attendance",
            path: "/attendance",
            icon: CalendarCheck,
        },
        {
            name: "Marks",
            path: "/marks",
            icon: GraduationCap,
        },
        {
            name: "Daily Report",
            path: "/daily-progress",
            icon: FileText,
        },
        {
            name: "Profile",
            path: "/profile",
            icon: User,
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("authChanged"));

        navigate("/");
    };

    return (
        <div
            className={`min-h-screen bg-white shadow-lg p-4
            transition-all duration-300 relative
            ${isOpen ? "w-64" : "w-20"}`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-8 bg-blue-600
                text-white p-2 rounded-lg shadow-md z-10"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 mb-10 mt-3">
                <GraduationCap
                    size={30}
                    className="text-blue-600 shrink-0"
                />

                {isOpen && (
                    <h1 className="text-2xl font-bold text-slate-900">
                        Edu <span className="text-blue-600">Track</span>
                    </h1>
                )}
            </div>

            {/* Menu */}
            <ul className="space-y-3">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                title={!isOpen ? item.name : ""}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-3 rounded-lg
                                    transition-all duration-200
                                    ${isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                                    }`
                                }
                            >
                                <Icon size={21} className="shrink-0" />

                                {isOpen && <span>{item.name}</span>}
                            </NavLink>
                        </li>
                    );
                })}
            </ul>

            {/* Logout */}
            <button
                onClick={handleLogout}
                title={!isOpen ? "Logout" : ""}
                className="flex items-center gap-3 text-red-500
                px-3 py-3 mt-10 hover:bg-red-50 rounded-lg w-full"
            >
                <LogOut size={21} className="shrink-0" />

                {isOpen && <span>Logout</span>}
            </button>
        </div>
    );
};

export default Sidebar;
