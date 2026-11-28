import { useState, useEffect, useMemo, useCallback } from "react";
import {
    CalendarDays,
    Users,
    UserCheck,
    UserX,
    Clock,
    ClipboardCheck,
    Trash2,
    RefreshCw,
} from "lucide-react";

import API from "../services/api";// Apne api.js ka correct path lagana

const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// JWT token ko Authorization header mein bhejne ke liye
const getAuthHeaders = () => {
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

const statuses = ["Present", "Absent", "Late", "Leave"];

const statusStyles = {
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    Late: "bg-yellow-100 text-yellow-700",
    Leave: "bg-blue-100 text-blue-700",
    "Not Marked": "bg-slate-100 text-slate-600",
};

const Attendance = () => {
    const [selectedDate, setSelectedDate] = useState(getToday());

    const [students, setStudents] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const [remarks, setRemarks] = useState({});
    const [statusFilter, setStatusFilter] = useState("All");

    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load students and selected date attendance
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const headers = getAuthHeaders();

            const [studentResponse, attendanceResponse] =
                await Promise.all([
                    API.get("/students", { headers }),
                    API.get("/attendance", {
                        params: { date: selectedDate },
                        headers,
                    }),
                ]);

            setStudents(studentResponse.data.students || []);
            setAttendanceRecords(
                attendanceResponse.data.attendance || []
            );

        } catch (err) {
            console.error("Attendance loading error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load attendance data."
            );
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Map attendance records using Student MongoDB ID
    const attendanceData = useMemo(() => {
        return students.map((student) => {
            const record = attendanceRecords.find(
                (item) =>
                    item.student?._id === student._id ||
                    item.student === student._id
            );

            return {
                ...student,
                attendanceRecord: record || null,
                attendanceStatus: record?.status || "Not Marked",
                attendanceId: record?._id || null,
                attendanceRemarks: record?.remarks || "",
            };
        });
    }, [students, attendanceRecords]);

    // Statistics
    const totalStudents = students.length;

    const presentStudents = attendanceData.filter(
        (student) => student.attendanceStatus === "Present"
    ).length;

    const absentStudents = attendanceData.filter(
        (student) => student.attendanceStatus === "Absent"
    ).length;

    const lateStudents = attendanceData.filter(
        (student) => student.attendanceStatus === "Late"
    ).length;

    const leaveStudents = attendanceData.filter(
        (student) => student.attendanceStatus === "Leave"
    ).length;

    const markedStudents =
        presentStudents + absentStudents + lateStudents + leaveStudents;

    const attendancePercentage = totalStudents
        ? Math.round((presentStudents / totalStudents) * 100)
        : 0;

    // Mark or update attendance
    const updateAttendance = async (studentId, status) => {
        try {
            setSavingId(studentId);
            setError("");
            setSuccess("");

            const headers = getAuthHeaders();

            const existingRecord = attendanceRecords.find(
                (item) =>
                    item.student?._id === studentId ||
                    item.student === studentId
            );

            const payload = {
                student: studentId,
                date: selectedDate,
                status,
                remarks: remarks[studentId] ?? existingRecord?.remarks ?? "",
            };

            if (existingRecord) {
                await API.put(
                    `/attendance/${existingRecord._id}`,
                    payload,
                    { headers }
                );
            } else {
                await API.post("/attendance", payload, { headers });
            }

            setSuccess(`Attendance marked as ${status}.`);

            await loadData();

        } catch (err) {
            console.error("Attendance update error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to update attendance."
            );
        } finally {
            setSavingId(null);
        }
    };

    // Delete attendance
    const deleteAttendance = async (attendanceId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this attendance?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccess("");

            await API.delete(`/attendance/${attendanceId}`, {
                headers: getAuthHeaders(),
            });

            setSuccess("Attendance deleted successfully.");

            await loadData();

        } catch (err) {
            console.error("Delete attendance error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to delete attendance."
            );
        }
    };

    // Status filter
    const filteredAttendance = useMemo(() => {
        if (statusFilter === "All") {
            return attendanceData;
        }

        return attendanceData.filter(
            (student) => student.attendanceStatus === statusFilter
        );
    }, [attendanceData, statusFilter]);

    const stats = [
        {
            title: "Total Students",
            value: totalStudents,
            icon: Users,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "Present",
            value: presentStudents,
            icon: UserCheck,
            color: "bg-green-100 text-green-600",
        },
        {
            title: "Absent",
            value: absentStudents,
            icon: UserX,
            color: "bg-red-100 text-red-600",
        },
        {
            title: "Attendance",
            value: `${attendancePercentage}%`,
            icon: CalendarDays,
            color: "bg-purple-100 text-purple-600",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Attendance Management
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage and track student attendance.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">

                    {/* Date */}
                    <div className="flex items-center gap-2 bg-white border rounded-lg px-4 py-3">
                        <CalendarDays
                            size={20}
                            className="text-blue-600"
                        />

                        <input
                            type="date"
                            value={selectedDate}
                            max={getToday()}
                            onChange={(e) =>
                                setSelectedDate(e.target.value)
                            }
                            className="outline-none text-slate-700"
                        />
                    </div>

                    {/* Refresh */}
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>

                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="mb-5 bg-red-100 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-5 bg-green-100 text-green-700 p-4 rounded-lg">
                    {success}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="bg-white p-6 rounded-xl shadow-sm border"
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
                                    <Icon size={24} />
                                </div>

                            </div>
                        </div>
                    );
                })}

            </div>

            {/* Additional statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                {[
                    { label: "Marked", value: markedStudents },
                    { label: "Not Marked", value: totalStudents - markedStudents },
                    { label: "Late", value: lateStudents },
                    { label: "Leave", value: leaveStudents },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="bg-white border rounded-xl p-4"
                    >
                        <p className="text-sm text-slate-500">
                            {item.label}
                        </p>

                        <h3 className="text-2xl font-bold text-slate-800 mt-1">
                            {item.value}
                        </h3>
                    </div>
                ))}

            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-xl shadow-sm border p-6">

                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Student Attendance
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Mark and manage student attendance.
                        </p>
                    </div>

                    {/* Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded-lg px-4 py-2 outline-none"
                    >
                        <option value="All">All Students</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Leave">Leave</option>
                        <option value="Not Marked">Not Marked</option>
                    </select>

                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-500">
                        Loading attendance...
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>
                                <tr className="border-b text-slate-500 text-sm">
                                    <th className="py-4 px-2">Roll No</th>
                                    <th className="py-4 px-2">Student Name</th>
                                    <th className="py-4 px-2">Class</th>
                                    <th className="py-4 px-2">Status</th>
                                    <th className="py-4 px-2">Remarks</th>
                                    <th className="py-4 px-2">Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredAttendance.length > 0 ? (
                                    filteredAttendance.map((student) => {
                                        const studentId = student._id;

                                        const studentName =
                                            student.user?.name || "Unknown";

                                        return (
                                            <tr
                                                key={studentId}
                                                className="border-b last:border-0 hover:bg-slate-50"
                                            >

                                                <td className="py-4 px-2 text-slate-600">
                                                    {student.rollNumber || "-"}
                                                </td>

                                                <td className="py-4 px-2 font-medium text-slate-800">
                                                    {studentName}
                                                </td>

                                                <td className="py-4 px-2 text-slate-600">
                                                    {student.className || "-"}
                                                    {student.section
                                                        ? ` - ${student.section}`
                                                        : ""}
                                                </td>

                                                <td className="py-4 px-2">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm ${statusStyles[student.attendanceStatus]}`}
                                                    >
                                                        {student.attendanceStatus}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Add remarks"
                                                        value={
                                                            remarks[studentId] ??
                                                            student.attendanceRemarks
                                                        }
                                                        onChange={(e) =>
                                                            setRemarks((prev) => ({
                                                                ...prev,
                                                                [studentId]: e.target.value,
                                                            }))
                                                        }
                                                        className="border rounded-lg px-3 py-2 w-36 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                    />
                                                </td>

                                                <td className="py-4 px-2">
                                                    <div className="flex flex-wrap gap-2">

                                                        {statuses.map((status) => (
                                                            <button
                                                                key={status}
                                                                disabled={savingId === studentId}
                                                                onClick={() =>
                                                                    updateAttendance(
                                                                        studentId,
                                                                        status
                                                                    )
                                                                }
                                                                className={`px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50 ${student.attendanceStatus === status
                                                                        ? "bg-slate-800 text-white"
                                                                        : statusStyles[status] +
                                                                        " hover:opacity-80"
                                                                    }`}
                                                            >
                                                                {savingId === studentId
                                                                    ? "Saving..."
                                                                    : status}
                                                            </button>
                                                        ))}

                                                        {student.attendanceId && (
                                                            <button
                                                                onClick={() =>
                                                                    deleteAttendance(
                                                                        student.attendanceId
                                                                    )
                                                                }
                                                                title="Delete attendance"
                                                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}

                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-12 text-slate-400"
                                        >
                                            {students.length === 0
                                                ? "No students available. Please add students first."
                                                : "No students found for this filter."}
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>

                    </div>
                )}

            </div>

        </div>
    );
};

export default Attendance;