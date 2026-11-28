import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    Users,
    UserCheck,
    UserX,
    BookOpen,
    ClipboardList,
    GraduationCap,
    TrendingUp,
    Clock,
    Plus,
    RefreshCw,
    FileText
} from "lucide-react";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [dailyReports, setDailyReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Admin Dashboard
    const fetchDashboard = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setLoading(false);
            return;
        }

        try {
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/dashboard/admin",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDashboard(response.data.data);

        } catch (error) {
            console.error("Dashboard Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard data."
            );
        }
    };

    // Fetch Daily Reports
    const fetchDailyReports = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/daily-reports",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDailyReports(response.data.reports || []);

        } catch (error) {
            console.error("Daily Reports Error:", error);
        }
    };

    // Refresh Both APIs
    const refreshDashboard = async () => {
        setLoading(true);

        await Promise.all([
            fetchDashboard(),
            fetchDailyReports()
        ]);

        setLoading(false);
    };

    useEffect(() => {
        refreshDashboard();
    }, []);

    // Attendance Count
    const getAttendanceCount = (status) => {
        const attendance = dashboard?.attendanceStats;

        if (!attendance) return 0;

        if (Array.isArray(attendance)) {
            return attendance.find(
                item => item._id?.toLowerCase() === status.toLowerCase()
            )?.count || 0;
        }

        const key = `total${status}`;

        return attendance[key] ?? attendance[status.toLowerCase()] ?? 0;
    };

    // Statistics
    const stats = [
        {
            title: "Total Students",
            value: dashboard?.totalStudents ?? 0,
            icon: Users,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Total Classes",
            value: dashboard?.totalClasses ?? 0,
            icon: BookOpen,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Attendance",
            value: `${dashboard?.attendanceStats?.attendancePercentage ?? 0}%`,
            icon: UserCheck,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Active Homework",
            value: dashboard?.activeHomework ?? 0,
            icon: ClipboardList,
            color: "bg-orange-100 text-orange-600"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw
                        className="animate-spin mx-auto text-blue-600"
                        size={35}
                    />

                    <p className="mt-3 text-slate-500">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6">
                <p className="text-red-600 font-medium mb-4">
                    {error}
                </p>

                <button
                    onClick={refreshDashboard}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const recentStudents = dashboard?.recentStudents || [];
    const recentHomework = dashboard?.recentHomework || [];
    const recentSubmissions = dashboard?.recentSubmissions || [];

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Admin Dashboard
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>

                <div className="flex gap-3">

                    <button
                        onClick={refreshDashboard}
                        className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-lg hover:bg-slate-100"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>

                    <button
                        onClick={() => navigate("/students")}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        Add Student
                    </button>

                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
                        >
                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-slate-500 text-sm">
                                        {item.title}
                                    </p>

                                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                        {item.value}
                                    </h2>
                                </div>

                                <div className={`p-3 rounded-lg ${item.color}`}>
                                    <Icon size={25} />
                                </div>

                            </div>
                        </div>
                    );
                })}

            </div>

            {/* Attendance and Homework */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                {/* Attendance */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">

                    <h2 className="text-xl font-bold text-slate-800 mb-6">
                        Attendance Overview
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        {[
                            {
                                title: "Present",
                                value: getAttendanceCount("Present"),
                                icon: UserCheck,
                                color: "text-green-600 bg-green-100"
                            },
                            {
                                title: "Absent",
                                value: getAttendanceCount("Absent"),
                                icon: UserX,
                                color: "text-red-600 bg-red-100"
                            },
                            {
                                title: "Late",
                                value: getAttendanceCount("Late"),
                                icon: Clock,
                                color: "text-orange-600 bg-orange-100"
                            },
                            {
                                title: "Leave",
                                value: getAttendanceCount("Leave"),
                                icon: ClipboardList,
                                color: "text-purple-600 bg-purple-100"
                            }
                        ].map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="bg-slate-50 p-4 rounded-lg flex items-center gap-3"
                                >
                                    <div className={`p-3 rounded-lg ${item.color}`}>
                                        <Icon size={22} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {item.title}
                                        </p>

                                        <h3 className="text-2xl font-bold text-slate-800">
                                            {item.value}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>

                {/* Homework Statistics */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">

                    <h2 className="text-xl font-bold text-slate-800 mb-6">
                        Homework Overview
                    </h2>

                    <div className="space-y-5">

                        <div className="flex justify-between">
                            <span className="text-slate-500">Total Homework</span>
                            <span className="font-bold">{dashboard?.totalHomework ?? 0}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">Active Homework</span>
                            <span className="font-bold text-blue-600">{dashboard?.activeHomework ?? 0}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">Total Submissions</span>
                            <span className="font-bold">{dashboard?.totalSubmissions ?? 0}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">Pending Submissions</span>
                            <span className="font-bold text-orange-600">{dashboard?.pendingSubmissions ?? 0}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">Reviewed Submissions</span>
                            <span className="font-bold text-green-600">{dashboard?.reviewedSubmissions ?? 0}</span>
                        </div>

                    </div>
                </div>

            </div>

            {/* Academic Performance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">

                        <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
                            <GraduationCap size={25} />
                        </div>

                        <div>
                            <p className="text-slate-500 text-sm">
                                Total Marks Records
                            </p>

                            <h2 className="text-2xl font-bold text-slate-800">
                                {dashboard?.totalMarksRecords ?? 0}
                            </h2>
                        </div>

                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">

                        <div className="p-3 rounded-lg bg-green-100 text-green-600">
                            <TrendingUp size={25} />
                        </div>

                        <div>
                            <p className="text-slate-500 text-sm">
                                Average Percentage
                            </p>

                            <h2 className="text-2xl font-bold text-slate-800">
                                {dashboard?.averagePercentage ?? 0}%
                            </h2>
                        </div>

                    </div>
                </div>

            </div>

            {/* Recent Students */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">

                <h2 className="text-xl font-bold text-slate-800 mb-6">
                    Recent Admissions
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">

                        <thead>
                            <tr className="border-b text-slate-500 text-sm">
                                <th className="py-4">Student Name</th>
                                <th className="py-4">Email</th>
                                <th className="py-4">Roll Number</th>
                                <th className="py-4">Class</th>
                                <th className="py-4">Admission Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentStudents.length > 0 ? (
                                recentStudents.map((student) => (
                                    <tr key={student._id} className="border-b last:border-0">

                                        <td className="py-4 font-medium text-slate-800">
                                            {student.user?.name || "N/A"}
                                        </td>

                                        <td className="py-4 text-slate-500">
                                            {student.user?.email || "N/A"}
                                        </td>

                                        <td className="py-4 text-slate-600">
                                            {student.rollNumber || "N/A"}
                                        </td>

                                        <td className="py-4 text-slate-600">
                                            {student.className || "N/A"}
                                        </td>

                                        <td className="py-4 text-slate-600">
                                            {student.admissionDate
                                                ? new Date(student.admissionDate).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-400">
                                        No recent admissions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Recent Homework */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">

                <h2 className="text-xl font-bold text-slate-800 mb-6">
                    Recent Homework
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">

                        <thead>
                            <tr className="border-b text-slate-500 text-sm">
                                <th className="py-4">Title</th>
                                <th className="py-4">Subject</th>
                                <th className="py-4">Due Date</th>
                                <th className="py-4">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentHomework.length > 0 ? (
                                recentHomework.map((item) => (
                                    <tr key={item._id} className="border-b last:border-0">

                                        <td className="py-4 font-medium">{item.title}</td>
                                        <td className="py-4 text-slate-600">{item.subject || "N/A"}</td>

                                        <td className="py-4 text-slate-600">
                                            {item.dueDate
                                                ? new Date(item.dueDate).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                        <td className="py-4">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                                {item.status || "N/A"}
                                            </span>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-slate-400">
                                        No recent homework found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">

                <h2 className="text-xl font-bold text-slate-800 mb-6">
                    Recent Submissions
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">

                        <thead>
                            <tr className="border-b text-slate-500 text-sm">
                                <th className="py-4">Student</th>
                                <th className="py-4">Homework</th>
                                <th className="py-4">Submitted Date</th>
                                <th className="py-4">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentSubmissions.length > 0 ? (
                                recentSubmissions.map((item) => (
                                    <tr key={item._id} className="border-b last:border-0">

                                        <td className="py-4 font-medium">
                                            {item.student?.user?.name ||
                                                item.student?.rollNumber ||
                                                "N/A"}
                                        </td>

                                        <td className="py-4 text-slate-600">
                                            {item.homework?.title || "N/A"}
                                        </td>

                                        <td className="py-4 text-slate-600">
                                            {item.submittedAt
                                                ? new Date(item.submittedAt).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                        <td className="py-4">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                                {item.status || "N/A"}
                                            </span>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-slate-400">
                                        No recent submissions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Recent Daily Reports */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">

                <div className="flex items-center gap-3 mb-6">

                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                        <FileText size={24} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Recent Daily Reports
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Students' daily progress and performance
                        </p>
                    </div>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead>
                            <tr className="border-b text-slate-500 text-sm">
                                <th className="py-4 pr-4">Student</th>
                                <th className="py-4 pr-4">Date</th>
                                <th className="py-4 pr-4">Attendance</th>
                                <th className="py-4 pr-4">Homework</th>
                                <th className="py-4 pr-4">Status</th>
                                <th className="py-4 pr-4">Performance</th>
                                <th className="py-4 pr-4">Teacher Remarks</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dailyReports.length > 0 ? (
                                dailyReports.slice(0, 10).map((report) => (

                                    <tr
                                        key={report._id}
                                        className="border-b last:border-0"
                                    >

                                        <td className="py-4 pr-4 font-medium text-slate-800">
                                            {report.student?.user?.name ||
                                                report.student?.name ||
                                                report.student?.rollNumber ||
                                                "N/A"}
                                        </td>

                                        <td className="py-4 pr-4 text-slate-600">
                                            {report.date
                                                ? new Date(report.date).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                        <td className="py-4 pr-4">
                                            <span className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${report.attendance === "Present"
                                                    ? "bg-green-100 text-green-700"
                                                    : report.attendance === "Absent"
                                                        ? "bg-red-100 text-red-700"
                                                        : report.attendance === "Late"
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-purple-100 text-purple-700"
                                                }`}>
                                                {report.attendance || "N/A"}
                                            </span>
                                        </td>

                                        <td className="py-4 pr-4 text-slate-600 max-w-xs">
                                            <p className="truncate" title={report.homework}>
                                                {report.homework || "N/A"}
                                            </p>
                                        </td>

                                        <td className="py-4 pr-4">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                                                {report.status || "Pending"}
                                            </span>
                                        </td>

                                        <td className="py-4 pr-4 text-slate-600 whitespace-nowrap">
                                            {report.academicPerformance?.subject
                                                ? `${report.academicPerformance.subject}: ${report.academicPerformance.score ?? 0}/${report.academicPerformance.totalMarks ?? 0}`
                                                : "N/A"}
                                        </td>

                                        <td className="py-4 pr-4 text-slate-600 max-w-xs">
                                            <p className="truncate" title={report.teacherRemarks}>
                                                {report.teacherRemarks || "N/A"}
                                            </p>
                                        </td>

                                    </tr>

                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-slate-400">
                                        No daily reports found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

                {dailyReports.length > 10 && (
                    <p className="text-sm text-slate-500 mt-4">
                        Showing latest 10 of {dailyReports.length} reports.
                    </p>
                )}

            </div>

        </div>
    );
};

export default AdminDashboard;