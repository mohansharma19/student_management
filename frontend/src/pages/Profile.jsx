
import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    CalendarDays,
    Edit,
    Save,
    X
} from "lucide-react";

import api from "../services/api";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [originalProfile, setOriginalProfile] = useState(null);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        className: "",
        rollNo: "",
        dateOfBirth: "",
        gender: ""
    });

    // FETCH LOGGED-IN USER PROFILE
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response = await api.get("/auth/me");

                const user = response.data.user || response.data;

                const userData = {
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    address: user.address || "",
                    className: user.className || "",
                    rollNo: user.rollNo || "",
                    dateOfBirth: user.dateOfBirth
                        ? user.dateOfBirth.slice(0, 10)
                        : "",
                    gender: user.gender || ""
                };

                setProfile(userData);
                setOriginalProfile(userData);

            } catch (error) {
                console.error(
                    "Profile fetch error:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // HANDLE INPUT CHANGE
    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // CANCEL EDIT
    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
    };

    // SAVE PROFILE
    const handleSave = async () => {
        try {
            // Backend update API will be connected here.
            // For now, this only updates the frontend state.

            setOriginalProfile(profile);
            setIsEditing(false);

            alert("Profile updated successfully!");

        } catch (error) {
            console.error("Profile update error:", error);
            alert("Failed to update profile.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        My Profile
                    </h1>

                    <p className="text-slate-500 mt-2">
                        View and manage your personal information.
                    </p>
                </div>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                    >
                        <Edit size={18} />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3">

                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-5 py-3 rounded-lg hover:bg-slate-300"
                        >
                            <X size={18} />
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
                        >
                            <Save size={18} />
                            Save
                        </button>

                    </div>
                )}
            </div>

            {/* PROFILE CARD */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">

                <div className="flex flex-col sm:flex-row items-center gap-5">

                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={48} className="text-blue-600" />
                    </div>

                    <div className="text-center sm:text-left">

                        <h2 className="text-2xl font-bold text-slate-800">
                            {profile.name || "Student"}
                        </h2>

                        <p className="text-slate-500 mt-1">
                            {profile.email}
                        </p>

                        <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">
                            {profile.className
                                ? `Class ${profile.className}`
                                : "Student Account"}
                        </span>

                    </div>
                </div>
            </div>

            {/* PERSONAL INFORMATION */}
            <div className="bg-white rounded-xl shadow-sm border p-6">

                <h2 className="text-xl font-bold text-slate-800 mb-6">
                    Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* FULL NAME */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Full Name
                        </label>

                        <div className="flex items-center border rounded-lg px-3">
                            <User size={18} className="text-slate-400" />

                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full p-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Email Address
                        </label>

                        <div className="flex items-center border rounded-lg px-3">
                            <Mail size={18} className="text-slate-400" />

                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                disabled
                                className="w-full p-3 outline-none bg-slate-50 text-slate-500"
                            />
                        </div>
                    </div>

                    {/* PHONE */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Phone Number
                        </label>

                        <div className="flex items-center border rounded-lg px-3">
                            <Phone size={18} className="text-slate-400" />

                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Enter phone number"
                                className="w-full p-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    {/* ADDRESS */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Address
                        </label>

                        <div className="flex items-center border rounded-lg px-3">
                            <MapPin size={18} className="text-slate-400" />

                            <input
                                type="text"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Enter address"
                                className="w-full p-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    {/* CLASS */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Class
                        </label>

                        <div className="flex items-center border rounded-lg px-3">
                            <GraduationCap size={18} className="text-slate-400" />

                            <input
                                type="text"
                                name="className"
                                value={profile.className}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Enter class"
                                className="w-full p-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    {/* ROLL NUMBER */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Roll Number
                        </label>

                        <input
                            type="text"
                            name="rollNo"
                            value={profile.rollNo}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Enter Roll Number"
                            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                        />
                    </div>

                    {/* DATE OF BIRTH */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Date of Birth
                        </label>

                        <div className="flex items-center border rounded-lg px-3">
                            <CalendarDays size={18} className="text-slate-400" />

                            <input
                                type="date"
                                name="dateOfBirth"
                                value={profile.dateOfBirth}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full p-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    {/* GENDER */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Gender
                        </label>

                        <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full border rounded-lg p-3 outline-none disabled:bg-white"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Profile;
