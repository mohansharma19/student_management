import { useState } from "react";
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

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        name: "Rahul Kumar",
        email: "rahul@gmail.com",
        phone: "9876543210",
        address: "Ranchi, Jharkhand",
        className: "10th",
        rollNo: "1025",
        dateOfBirth: "2005-08-15",
        gender: "Male"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile({
            ...profile,
            [name]: value
        });
    };

    const handleSave = () => {
        setIsEditing(false);
        alert("Profile updated successfully!");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">

            {/* Header */}
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
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-5 py-3 rounded-lg"
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

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={48} className="text-blue-600" />
                    </div>

                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-slate-800">
                            {profile.name}
                        </h2>
                        <p className="text-slate-500 mt-1">
                            Student Account
                        </p>
                        <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">
                            Class {profile.className}
                        </span>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6">
                    Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Full Name */}
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

                    {/* Email */}
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
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full p-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    {/* Phone */}
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
                                className="w-full p-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    {/* Address */}
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
                                className="w-full p-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    {/* Class */}
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
                                className="w-full p-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    {/* Roll Number */}
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
                            className="w-full border rounded-lg p-3 outline-none 
        focus:ring-2 focus:ring-blue-500
        disabled:bg-slate-50 disabled:text-slate-500"
                        />
                    </div>


                    {/* Date of Birth */}
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

                    {/* Gender */}
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