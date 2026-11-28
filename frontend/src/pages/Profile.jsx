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
    X,
    Users,
    Hash,
    Loader2,
} from "lucide-react";

import api from "../services/api";

// Reusable Input Field - Outside Profile Component
const ProfileField = ({
    label,
    name,
    value,
    icon: Icon,
    type = "text",
    disabled = false,
    options,
    isEditing,
    handleChange,
}) => (
    <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
            {label}
        </label>

        <div className="relative">
            <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            {options ? (
                <select
                    name={name}
                    value={value}
                    onChange={handleChange}
                    disabled={!isEditing || disabled}
                    className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500 disabled:bg-gray-100"
                >
                    <option value="">Select {label}</option>

                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    disabled={!isEditing || disabled}
                    className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
            )}
        </div>
    </div>
);

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [role, setRole] = useState("");

    const initialProfile = {
        name: "",
        email: "",
        phone: "",
        profileImage: "",
        address: "",
        className: "",
        rollNumber: "",
        section: "",
        dateOfBirth: "",
        gender: "",
        parentName: "",
        parentPhone: "",
    };

    const [profile, setProfile] = useState(initialProfile);
    const [originalProfile, setOriginalProfile] = useState(initialProfile);

    // Format Profile Data
    const formatProfile = (user, studentProfile) => ({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profileImage: user.profileImage || "",

        address: studentProfile?.address || "",
        className: studentProfile?.className || "",
        rollNumber: studentProfile?.rollNumber || "",
        section: studentProfile?.section || "",

        dateOfBirth: studentProfile?.dateOfBirth
            ? new Date(studentProfile.dateOfBirth)
                .toISOString()
                .split("T")[0]
            : "",

        gender: studentProfile?.gender || "",
        parentName: studentProfile?.parentName || "",
        parentPhone: studentProfile?.parentPhone || "",
    });

    // Fetch Profile
    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/profile/me");

            const { user, studentProfile } = response.data.data;

            setRole(user.role?.toLowerCase() || "");

            const profileData = formatProfile(user, studentProfile);

            setProfile(profileData);
            setOriginalProfile(profileData);

        } catch (err) {
            console.error("Profile fetch error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Cancel Editing
    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
        setError("");
        setSuccess("");
    };

    // Save Profile
    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                name: profile.name.trim(),
                phone: profile.phone.trim(),
            };

            if (role === "student") {
                payload.address = profile.address;
                payload.dateOfBirth = profile.dateOfBirth || null;
                payload.gender = profile.gender;
                payload.parentName = profile.parentName.trim();
                payload.parentPhone = profile.parentPhone.trim();
            }

            const response = await api.put("/profile/me", payload);

            const { user, studentProfile } = response.data.data;

            const updatedProfile = formatProfile(user, studentProfile);

            setProfile(updatedProfile);
            setOriginalProfile(updatedProfile);

            setIsEditing(false);
            setSuccess("Profile updated successfully!");

        } catch (err) {
            console.error("Profile update error:", err);

            setError(
                err.response?.data?.message ||
                "Profile update failed. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // Loading Screen
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                <span className="ml-3 text-gray-600">
                    Loading profile...
                </span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">

            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                            My Profile
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Manage your personal information
                        </p>
                    </div>

                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(true);
                                setError("");
                                setSuccess("");
                            }}
                            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            <Edit size={18} />
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                            >
                                <X size={18} />
                                Cancel
                            </button>

                            <button
                                type="submit"
                                form="profileForm"
                                disabled={saving}
                                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                            >
                                {saving ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Save size={18} />
                                )}

                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                        </div>
                    )}
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                        {success}
                    </div>
                )}

                <form id="profileForm" onSubmit={handleSave}>

                    {/* Profile Information */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                        <div className="flex flex-col items-center gap-4 sm:flex-row">

                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                                <User size={45} className="text-blue-600" />
                            </div>

                            <div className="text-center sm:text-left">

                                <h2 className="text-xl font-bold text-gray-800">
                                    {profile.name || "User"}
                                </h2>

                                <p className="text-gray-500">
                                    {profile.email}
                                </p>

                                <span className="mt-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold capitalize text-blue-700">
                                    {role}
                                </span>

                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-6 text-xl font-bold text-gray-800">
                            Personal Information
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            <ProfileField
                                label="Full Name"
                                name="name"
                                value={profile.name}
                                icon={User}
                                isEditing={isEditing}
                                handleChange={handleChange}
                            />

                            <ProfileField
                                label="Email Address"
                                name="email"
                                value={profile.email}
                                icon={Mail}
                                disabled
                                isEditing={isEditing}
                                handleChange={handleChange}
                            />

                            <ProfileField
                                label="Phone Number"
                                name="phone"
                                value={profile.phone}
                                icon={Phone}
                                isEditing={isEditing}
                                handleChange={handleChange}
                            />

                            {role === "student" && (
                                <>
                                    <ProfileField
                                        label="Address"
                                        name="address"
                                        value={profile.address}
                                        icon={MapPin}
                                        isEditing={isEditing}
                                        handleChange={handleChange}
                                    />

                                    <ProfileField
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        value={profile.dateOfBirth}
                                        icon={CalendarDays}
                                        type="date"
                                        isEditing={isEditing}
                                        handleChange={handleChange}
                                    />

                                    <ProfileField
                                        label="Gender"
                                        name="gender"
                                        value={profile.gender}
                                        icon={User}
                                        options={["Male", "Female", "Other"]}
                                        isEditing={isEditing}
                                        handleChange={handleChange}
                                    />
                                </>
                            )}

                        </div>
                    </div>

                    {/* Academic Information */}
                    {role === "student" && (
                        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="mb-6 text-xl font-bold text-gray-800">
                                Academic Information
                            </h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                <ProfileField
                                    label="Class"
                                    name="className"
                                    value={profile.className}
                                    icon={GraduationCap}
                                    disabled
                                    isEditing={isEditing}
                                    handleChange={handleChange}
                                />

                                <ProfileField
                                    label="Roll Number"
                                    name="rollNumber"
                                    value={profile.rollNumber}
                                    icon={Hash}
                                    disabled
                                    isEditing={isEditing}
                                    handleChange={handleChange}
                                />

                                <ProfileField
                                    label="Section"
                                    name="section"
                                    value={profile.section}
                                    icon={Users}
                                    disabled
                                    isEditing={isEditing}
                                    handleChange={handleChange}
                                />

                            </div>
                        </div>
                    )}

                    {/* Parent / Guardian Information */}
                    {role === "student" && (
                        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="mb-6 text-xl font-bold text-gray-800">
                                Parent / Guardian Information
                            </h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                <ProfileField
                                    label="Parent Name"
                                    name="parentName"
                                    value={profile.parentName}
                                    icon={Users}
                                    isEditing={isEditing}
                                    handleChange={handleChange}
                                />

                                <ProfileField
                                    label="Parent Phone Number"
                                    name="parentPhone"
                                    value={profile.parentPhone}
                                    icon={Phone}
                                    type="tel"
                                    isEditing={isEditing}
                                    handleChange={handleChange}
                                />

                            </div>
                        </div>
                    )}

                </form>

            </div>
        </div>
    );
};

export default Profile;