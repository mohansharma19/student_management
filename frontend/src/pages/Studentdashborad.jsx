
import { useState } from "react";
import {
    BookOpen,
    CalendarCheck,
    ClipboardList,
    TrendingUp,
    CalendarDays,
    Clock,
    CheckCircle,
    XCircle,
    User
} from "lucide-react";

const studentsData = [
    {
        id: 1,
        name: "Rahul Kumar",
        class: "10th",
        rollNo: "1025",
        subjects: [
            { name: "Mathematics", marks: 90 },
            { name: "Science", marks: 85 },
            { name: "English", marks: 80 },
            { name: "Computer", marks: 95 }
        ],
        attendance: [
            { subject: "Mathematics", date: "18 Nov 2026", status: "Present" },
            { subject: "Science", date: "19 Nov 2026", status: "Present" },
            { subject: "English", date: "20 Nov 2026", status: "Absent" },
            { subject: "Computer", date: "20 Nov 2026", status: "Present" }
        ],
        exams: [
            { subject: "Mathematics", date: "25 Nov 2026", time: "10:00 AM" },
            { subject: "Science", date: "28 Nov 2026", time: "11:00 AM" }
        ],
        attendancePercentage: 92
    },
    {
        id: 2,
        name: "Aman Sharma",
        class: "12th",
        rollNo: "1026",
        subjects: [
            { name: "Mathematics", marks: 75 },
            { name: "Physics", marks: 88 },
            { name: "Chemistry", marks: 82 },
            { name: "English", marks: 90 }
        ],
        attendance: [
            { subject: "Mathematics", date: "18 Nov 2026", status: "Present" },
            { subject: "Physics", date: "19 Nov 2026", status: "Absent" },
            { subject: "Chemistry", date: "20 Nov 2026", status: "Present" },
            { subject: "English", date: "20 Nov 2026", status: "Present" }
        ],
        exams: [
            { subject: "Physics", date: "26 Nov 2026", time: "10:00 AM" },
            { subject: "Chemistry", date: "30 Nov 2026", time: "11:00 AM" }
        ],
        attendancePercentage: 85
    },
    {
        id: 3,
        name: "Priya Singh",
        class: "11th",
        rollNo: "1027",
        subjects: [
            { name: "Mathematics", marks: 95 },
            { name: "Biology", marks: 92 },
            { name: "Chemistry", marks: 89 },
            { name: "English", marks: 88 }
        ],
        attendance: [
            { subject: "Mathematics", date: "18 Nov 2026", status: "Present" },
            { subject: "Biology", date: "19 Nov 2026", status: "Present" },
            { subject: "Chemistry", date: "20 Nov 2026", status: "Present" },
            { subject: "English", date: "20 Nov 2026", status: "Present" }
        ],
        exams: [
            { subject: "Biology", date: "27 Nov 2026", time: "10:00 AM" },
            { subject: "Mathematics", date: "29 Nov 2026", time: "11:00 AM" }
        ],
        attendancePercentage: 98
    }
];

const StudentDashboard = () => {

    const [studentId, setStudentId] = useState(1);

    const student = studentsData.find(
        (item) => item.id === Number(studentId)
    );

    const averageMarks = Math.round(
        student.subjects.reduce((total, item) => total + item.marks, 0) /
        student.subjects.length
    );

    const presentCount = student.attendance.filter(
        (item) => item.status === "Present"
    ).length;

    const absentCount = student.attendance.length - presentCount;

    const stats = [
        {
            title: "Total Subjects",
            value: student.subjects.length,
            icon: BookOpen,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Attendance",
            value: `${student.attendancePercentage}%`,
            icon: CalendarCheck,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Average Marks",
            value: `${averageMarks}%`,
            icon: TrendingUp,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Upcoming Exams",
            value: student.exams.length,
            icon: ClipboardList,
            color: "bg-orange-100 text-orange-600"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Student Dashboard
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Welcome back, {student.name}! Here's your academic overview.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border">

                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {student.name.split(" ").map(word => word[0]).join("")}
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-800">
                            {student.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                            Class {student.class} | Roll No. {student.rollNo}
                        </p>
                    </div>

                    <select
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {studentsData.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

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
                                    <Icon size={25} />
                                </div>

                            </div>
                        </div>
                    );
                })}

            </div>

            {/* Attendance and Marks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                {/* Attendance */}
                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <div className="flex justify-between items-center mb-6">

                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                Recent Attendance
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Your latest attendance records.
                            </p>
                        </div>

                        <CalendarCheck className="text-blue-600" size={25} />

                    </div>

                    <div className="space-y-4">

                        {student.attendance.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0"
                            >

                                <div>
                                    <h3 className="font-medium text-slate-800">
                                        {item.subject}
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1">
                                        {item.date}
                                    </p>
                                </div>

                                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${item.status === "Present"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}>
                                    {item.status === "Present"
                                        ? <CheckCircle size={15} />
                                        : <XCircle size={15} />
                                    }

                                    {item.status}
                                </span>

                            </div>
                        ))}

                    </div>

                </div>

                {/* Subject Marks */}
                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <div className="flex justify-between items-center mb-6">

                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                Subject Performance
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Your latest marks in each subject.
                            </p>
                        </div>

                        <TrendingUp className="text-green-600" size={25} />

                    </div>

                    <div className="space-y-6">

                        {student.subjects.map((item) => (
                            <div key={item.name}>

                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-slate-700">
                                        {item.name}
                                    </span>

                                    <span className="font-semibold text-slate-800">
                                        {item.marks}/100
                                    </span>
                                </div>

                                <div className="w-full bg-slate-100 h-2.5 rounded-full">

                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${item.marks}%` }}
                                    />

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </div>

            {/* Upcoming Exams */}
            <div className="bg-white rounded-xl shadow-sm border p-6">

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Upcoming Exams
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Prepare for your upcoming examinations.
                        </p>
                    </div>

                    <CalendarDays className="text-orange-500" size={25} />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {student.exams.map((exam) => (
                        <div
                            key={exam.subject}
                            className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100"
                        >

                            <div className="p-3 bg-white rounded-lg text-blue-600">
                                <BookOpen size={25} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-800">
                                    {exam.subject}
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    {exam.date}
                                </p>

                                <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                                    <Clock size={14} />
                                    {exam.time}
                                </p>
                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
};

export default StudentDashboard;
       