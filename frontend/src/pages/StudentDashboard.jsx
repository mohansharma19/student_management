
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/student/profile/me";

const StudentDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Student Dashboard
    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Session expired. Please login again.");
                return;
            }

            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                // Backend returns { success, message, student }
                const student = response.data.student;

                setDashboard({
                    studentProfile: student,
                    attendanceStats: {},
                    marks: [],
                    homeworkStats: {},
                    pendingHomework: [],
                    submissions: [],
                    dailyReports: [],
                });
            } else {
                setError(
                    response.data.message || "Dashboard loading failed"
                );
            }

        } catch (err) {
            console.error(
                "Student Dashboard Error:",
                err.response?.data || err.message
            );

            if (err.response?.status === 401) {
                setError("Session expired. Please login again.");
            } else if (err.response?.status === 403) {
                setError(
                    err.response?.data?.message ||
                    "You don't have permission to access this dashboard."
                );
            } else if (err.response?.status === 404) {
                setError(
                    err.response?.data?.message ||
                    "Student profile not found. Please contact admin."
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Date Formatter
    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold text-gray-600">
                    Loading Dashboard...
                </p>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-5">
                <p className="text-red-600 font-semibold text-center">
                    {error}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={fetchDashboard}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                    >
                        Retry
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/login";
                        }}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg"
                    >
                        Login Again
                    </button>
                </div>
            </div>
        );
    }

    if (!dashboard) return null;

    const {
        studentProfile,
        attendanceStats,
        marks,
        homeworkStats,
        pendingHomework,
        submissions,
        dailyReports,
    } = dashboard;

    const profile = studentProfile?.user || {};

    const statCards = [
        {
            title: "Attendance",
            value: `${attendanceStats?.attendancePercentage ?? 0}%`,
            subtitle: "Overall attendance",
            color: "bg-blue-50 text-blue-600",
        },
        {
            title: "Total Present",
            value: attendanceStats?.totalPresent ?? 0,
            subtitle: "Present days",
            color: "bg-green-50 text-green-600",
        },
        {
            title: "Pending Homework",
            value: homeworkStats?.pendingHomework ?? 0,
            subtitle: "Homework remaining",
            color: "bg-orange-50 text-orange-600",
        },
        {
            title: "Submitted Homework",
            value: homeworkStats?.submittedHomework ?? 0,
            subtitle: "Completed submissions",
            color: "bg-purple-50 text-purple-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Student Dashboard
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Welcome back, {profile.name || "Student"}!
                    </p>
                </div>

                <button
                    onClick={fetchDashboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
                >
                    Refresh Dashboard
                </button>
            </div>

            {/* Student Profile */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <img
                        src={
                            profile.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "Student")}&background=2563eb&color=fff`
                        }
                        alt="Student"
                        className="w-20 h-20 rounded-full object-cover"
                    />

                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold text-gray-800">
                            {profile.name || "Student"}
                        </h2>

                        <p className="text-gray-500">
                            {profile.email || "N/A"}
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                            Roll No: {studentProfile?.rollNumber || "N/A"}
                            {" | "}
                            Class: {studentProfile?.className || "N/A"}
                            {" | "}
                            Section: {studentProfile?.section || "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {statCards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <p className="text-gray-500 text-sm">
                            {card.title}
                        </p>

                        <h2 className="text-3xl font-bold text-gray-800 mt-3">
                            {card.value}
                        </h2>

                        <p className={`text-xs mt-3 inline-block px-3 py-1 rounded-full ${card.color}`}>
                            {card.subtitle}
                        </p>
                    </div>
                ))}
            </div>

            {/* Attendance Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                    Attendance Overview
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        ["Present", attendanceStats?.totalPresent, "text-green-600"],
                        ["Absent", attendanceStats?.totalAbsent, "text-red-600"],
                        ["Late", attendanceStats?.totalLate, "text-orange-600"],
                        ["Leave", attendanceStats?.totalLeave, "text-blue-600"],
                    ].map(([label, value, color]) => (
                        <div key={label} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-500 text-sm">{label}</p>
                            <h3 className={`text-2xl font-bold mt-2 ${color}`}>
                                {value ?? 0}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Homework and Submissions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                {/* Pending Homework */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-5">
                        Pending Homework
                    </h2>

                    {pendingHomework.length > 0 ? (
                        <div className="space-y-4">
                            {pendingHomework.map((item) => (
                                <div key={item._id} className="border border-gray-100 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Subject: {item.subject || "N/A"}
                                    </p>

                                    <p className="text-sm text-red-500 mt-2">
                                        Due: {formatDate(item.dueDate)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No pending homework.</p>
                    )}
                </div>

                {/* Recent Submissions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-5">
                        Recent Submissions
                    </h2>

                    {submissions.length > 0 ? (
                        <div className="space-y-4">
                            {submissions.slice(0, 5).map((item) => (
                                <div key={item._id} className="border border-gray-100 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800">
                                        {item.homework?.title || "Homework"}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Subject: {item.homework?.subject || "N/A"}
                                    </p>

                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-xs text-gray-500">
                                            {formatDate(item.submittedAt)}
                                        </span>

                                        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                                            {item.status || "Pending"}
                                        </span>
                                    </div>

                                    {item.marksObtained != null && (
                                        <p className="text-sm font-semibold mt-2">
                                            Marks: {item.marksObtained}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No submissions found.</p>
                    )}
                </div>
            </div>

            {/* Recent Marks */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                    Recent Marks
                </h2>

                {marks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[500px]">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm">
                                    <th className="p-3">Subject</th>
                                    <th className="p-3">Exam</th>
                                    <th className="p-3">Obtained Marks</th>
                                    <th className="p-3">Total Marks</th>
                                </tr>
                            </thead>

                            <tbody>
                                {marks.slice(0, 5).map((item) => (
                                    <tr key={item._id} className="border-b">
                                        <td className="p-3">{item.subject || "N/A"}</td>
                                        <td className="p-3">{item.examType || "N/A"}</td>
                                        <td className="p-3">{item.obtainedMarks ?? "N/A"}</td>
                                        <td className="p-3">{item.totalMarks ?? "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No marks available.</p>
                )}
            </div>

            {/* Recent Daily Reports */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                    Recent Daily Reports
                </h2>

                {dailyReports.length > 0 ? (
                    <div className="space-y-3">
                        {dailyReports.map((report) => (
                            <div key={report._id} className="border border-gray-100 rounded-lg p-4">
                                <p className="font-semibold text-gray-800">
                                    {formatDate(report.date)}
                                </p>

                                <p className="text-gray-600 text-sm mt-2">
                                    {report.description ||
                                        report.remarks ||
                                        report.report ||
                                        "Daily report available"}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No daily reports available.</p>
                )}
            </div>

        </div>
    );
};

export default StudentDashboard;
