
import { useState, useEffect, useMemo } from "react";

import {
    CalendarDays,
    Users,
    UserCheck,
    UserX
} from "lucide-react";

const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const Attendance = () => {

    const [selectedDate, setSelectedDate] = useState(getToday());

    // Students added from Admin Dashboard
    const [students, setStudents] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("students")) || [];
        } catch {
            return [];
        }
    });

    // Date-wise attendance records
    const [attendanceRecords, setAttendanceRecords] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("attendanceRecords")
            ) || {};
        } catch {
            return {};
        }
    });

    // Update students when Admin adds new students
    useEffect(() => {
        const loadStudents = () => {
            try {
                const savedStudents = JSON.parse(
                    localStorage.getItem("students")
                ) || [];

                setStudents(savedStudents);
            } catch {
                setStudents([]);
            }
        };

        window.addEventListener("storage", loadStudents);
        window.addEventListener("studentsUpdated", loadStudents);

        return () => {
            window.removeEventListener("storage", loadStudents);
            window.removeEventListener("studentsUpdated", loadStudents);
        };
    }, []);

    // Save attendance records
    useEffect(() => {
        localStorage.setItem(
            "attendanceRecords",
            JSON.stringify(attendanceRecords)
        );
    }, [attendanceRecords]);

    // Get attendance for selected date
    const attendanceData = useMemo(() => {
        const dateRecords = attendanceRecords[selectedDate] || {};

        return students.map((student) => ({
            ...student,
            attendanceStatus: dateRecords[student.id] || "Not Marked"
        }));
    }, [students, attendanceRecords, selectedDate]);

    // Calculate Statistics
    const totalStudents = students.length;

    const presentStudents = attendanceData.filter(
        (student) => student.attendanceStatus === "Present"
    ).length;

    const absentStudents = attendanceData.filter(
        (student) => student.attendanceStatus === "Absent"
    ).length;

    const attendancePercentage = totalStudents
        ? Math.round((presentStudents / totalStudents) * 100)
        : 0;

    // Mark Attendance
    const updateAttendance = (studentId, status) => {

        setAttendanceRecords((prev) => ({
            ...prev,

            [selectedDate]: {
                ...(prev[selectedDate] || {}),
                [studentId]: status
            }
        }));

    };

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

                {/* Date */}
                <div className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2">

                    <CalendarDays size={20} className="text-blue-600" />

                    <input
                        type="date"
                        value={selectedDate}
                        max={getToday()}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="outline-none text-slate-700"
                    />

                </div>

            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

                {[
                    {
                        title: "Total Students",
                        value: totalStudents,
                        icon: Users,
                        color: "bg-blue-100 text-blue-600"
                    },
                    {
                        title: "Present",
                        value: presentStudents,
                        icon: UserCheck,
                        color: "bg-green-100 text-green-600"
                    },
                    {
                        title: "Absent",
                        value: absentStudents,
                        icon: UserX,
                        color: "bg-red-100 text-red-600"
                    },
                    {
                        title: "Attendance",
                        value: `${attendancePercentage}%`,
                        icon: CalendarDays,
                        color: "bg-purple-100 text-purple-600"
                    }
                ].map((item) => {

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

            {/* Attendance Table */}
            <div className="bg-white rounded-xl shadow-sm border p-6">

                <div className="mb-6">

                    <h2 className="text-xl font-bold text-slate-800">
                        Student Attendance
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Mark students as present or absent.
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead>
                            <tr className="border-b text-slate-500 text-sm">

                                <th className="py-4">Roll No</th>
                                <th className="py-4">Student Name</th>
                                <th className="py-4">Class</th>
                                <th className="py-4">Status</th>
                                <th className="py-4">Action</th>

                            </tr>
                        </thead>

                        <tbody>

                            {attendanceData.length > 0 ? (

                                attendanceData.map((student) => (

                                    <tr
                                        key={student.id}
                                        className="border-b last:border-0"
                                    >

                                        <td className="py-4 text-slate-600">
                                            {student.rollNo || student.id}
                                        </td>

                                        <td className="py-4 font-medium text-slate-800">
                                            {student.name}
                                        </td>

                                        <td className="py-4 text-slate-600">
                                            {student.class || "-"}
                                        </td>

                                        <td className="py-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${student.attendanceStatus === "Present"
                                                        ? "bg-green-100 text-green-700"
                                                        : student.attendanceStatus === "Absent"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {student.attendanceStatus}
                                            </span>

                                        </td>

                                        <td className="py-4">

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        updateAttendance(
                                                            student.id,
                                                            "Present"
                                                        )
                                                    }
                                                    className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm hover:bg-green-200"
                                                >
                                                    Present
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        updateAttendance(
                                                            student.id,
                                                            "Absent"
                                                        )
                                                    }
                                                    className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm hover:bg-red-200"
                                                >
                                                    Absent
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-12 text-slate-400"
                                    >
                                        No students available. Please add students from Admin Dashboard first.
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default Attendance;
