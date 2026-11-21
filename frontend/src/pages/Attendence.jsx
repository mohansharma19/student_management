import { useState } from "react";

import {
    CalendarDays,
    Users,
    UserCheck,
    UserX
} from "lucide-react";

const Attendance = () => {

    const [selectedDate, setSelectedDate] = useState(
        "2026-11-20"
    );

    const [students, setStudents] = useState([
        {
            id: 1,
            name: "Rahul Kumar",
            rollNo: "101",
            class: "10th",
            status: "Present"
        },
        {
            id: 2,
            name: "Aman Sharma",
            rollNo: "102",
            class: "10th",
            status: "Absent"
        },
        {
            id: 3,
            name: "Priya Singh",
            rollNo: "103",
            class: "10th",
            status: "Present"
        },
        {
            id: 4,
            name: "Rohit Verma",
            rollNo: "104",
            class: "10th",
            status: "Present"
        },
        {
            id: 5,
            name: "Ankit Kumar",
            rollNo: "105",
            class: "10th",
            status: "Absent"
        }
    ]);

    // Calculate attendance
    const totalStudents = students.length;

    const presentStudents = students.filter(
        (student) => student.status === "Present"
    ).length;

    const absentStudents = students.filter(
        (student) => student.status === "Absent"
    ).length;

    const attendancePercentage = totalStudents
        ? Math.round((presentStudents / totalStudents) * 100)
        : 0;

    // Update attendance
    const updateAttendance = (id, status) => {
        setStudents(
            students.map((student) =>
                student.id === id
                    ? { ...student, status: status }
                    : student
            )
        );
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
                            {students.map((student) => (

                                <tr
                                    key={student.id}
                                    className="border-b last:border-0"
                                >

                                    <td className="py-4 text-slate-600">
                                        {student.rollNo}
                                    </td>

                                    <td className="py-4 font-medium text-slate-800">
                                        {student.name}
                                    </td>

                                    <td className="py-4 text-slate-600">
                                        {student.class}
                                    </td>

                                    <td className="py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${student.status === "Present"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {student.status}
                                        </span>
                                    </td>

                                    <td className="py-4">

                                        <div className="flex gap-2">

                                            <button
                                                onClick={() =>
                                                    updateAttendance(student.id, "Present")
                                                }
                                                className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm hover:bg-green-200"
                                            >
                                                Present
                                            </button>

                                            <button
                                                onClick={() =>
                                                    updateAttendance(student.id, "Absent")
                                                }
                                                className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm hover:bg-red-200"
                                            >
                                                Absent
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default Attendance;