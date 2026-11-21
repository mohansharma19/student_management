import { useState } from "react";
import { GraduationCap, Users, TrendingUp } from "lucide-react";

const Marks = () => {
    const [students, setStudents] = useState([
        {
            id: 1,
            name: "Rahul Kumar",
            rollNo: "101",
            subject: "Mathematics",
            marks: 90,
            total: 100
        },
        {
            id: 2,
            name: "Aman Sharma",
            rollNo: "102",
            subject: "Science",
            marks: 75,
            total: 100
        },
        {
            id: 3,
            name: "Priya Singh",
            rollNo: "103",
            subject: "English",
            marks: 85,
            total: 100
        },
        {
            id: 4,
            name: "Rohit Verma",
            rollNo: "104",
            subject: "Mathematics",
            marks: 60,
            total: 100
        },
        {
            id: 5,
            name: "Ankit Kumar",
            rollNo: "105",
            subject: "Science",
            marks: 95,
            total: 100
        }
    ]);

    // Calculate average marks
    const averageMarks = students.length
        ? Math.round(
            students.reduce((sum, student) => sum + student.marks, 0) /
            students.length
        )
        : 0;

    // Calculate grade
    const getGrade = (marks) => {
        if (marks >= 90) return "A+";
        if (marks >= 80) return "A";
        if (marks >= 70) return "B";
        if (marks >= 60) return "C";
        if (marks >= 40) return "D";
        if (marks >= 33) return "E"
        return "F";
    };

    // Update marks
    const updateMarks = (id, newMarks) => {
        const value = Number(newMarks);

        if (newMarks === "" || (value >= 0 && value <= 100)) {
            setStudents(
                students.map((student) =>
                    student.id === id
                        ? { ...student, marks: newMarks === "" ? "" : value }
                        : student
                )
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">
                    Marks Management
                </h1>
                <p className="text-slate-500 mt-2">
                    Manage student marks and academic performance.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-slate-500 text-sm">Total Students</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                {students.length}
                            </h2>
                        </div>
                        <Users size={28} className="text-blue-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-slate-500 text-sm">Average Marks</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                {averageMarks}/100
                            </h2>
                        </div>
                        <TrendingUp size={28} className="text-green-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-slate-500 text-sm">Subjects</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                3
                            </h2>
                        </div>
                        <GraduationCap size={28} className="text-purple-600" />
                    </div>
                </div>

            </div>

            {/* Marks Table */}
            <div className="bg-white rounded-xl shadow-sm border p-6">

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">
                        Student Marks
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        View and update student marks.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">

                        <thead>
                            <tr className="border-b text-slate-500 text-sm">
                                <th className="py-4">Roll No</th>
                                <th className="py-4">Student Name</th>
                                <th className="py-4">Subject</th>
                                <th className="py-4">Marks</th>
                                <th className="py-4">Grade</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="border-b last:border-0">

                                    <td className="py-4 text-slate-600">
                                        {student.rollNo}
                                    </td>

                                    <td className="py-4 font-medium text-slate-800">
                                        {student.name}
                                    </td>

                                    <td className="py-4 text-slate-600">
                                        {student.subject}
                                    </td>

                                    <td className="py-4">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={student.marks}
                                            onChange={(e) =>
                                                updateMarks(student.id, e.target.value)
                                            }
                                            className="w-20 border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        />
                                        <span className="text-slate-400 ml-2">
                                            / {student.total}
                                        </span>
                                    </td>

                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGrade(Number(student.marks)) === "F"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"
                                            }`}>
                                            {getGrade(Number(student.marks))}
                                        </span>
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

export default Marks;