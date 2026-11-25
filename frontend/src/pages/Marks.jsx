
import { useState } from "react";
import {
    GraduationCap,
    Users,
    TrendingUp,
    Plus,
    Pencil,
    Trash2,
    X,
    Save
} from "lucide-react";

const Marks = () => {
    const [students, setStudents] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        rollNo: "",
        subject: "",
        marks: "",
        total: 100
    });

    const averageMarks = students.length
        ? Math.round(
            students.reduce(
                (sum, student) =>
                    sum + (student.marks / student.total) * 100,
                0
            ) / students.length
        )
        : 0;

    const subjects = new Set(
        students.map(student => student.subject)
    ).size;

    const getGrade = (marks, total) => {
        const percentage = (marks / total) * 100;

        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 40) return "D";
        if (percentage >= 33) return "E";
        return "F";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const resetForm = () => {
        setFormData({
            name: "",
            rollNo: "",
            subject: "",
            marks: "",
            total: 100
        });

        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const marks = Number(formData.marks);
        const total = Number(formData.total);

        if (
            !formData.name.trim() ||
            !formData.rollNo.trim() ||
            !formData.subject.trim() ||
            formData.marks === "" ||
            !Number.isFinite(total) ||
            total <= 0 ||
            !Number.isFinite(marks) ||
            marks < 0 ||
            marks > total
        ) {
            alert("Please enter valid student details and marks.");
            return;
        }

        if (editingId !== null) {
            setStudents(prev =>
                prev.map(student =>
                    student.id === editingId
                        ? {
                            ...formData,
                            marks,
                            total,
                            id: editingId
                        }
                        : student
                )
            );
        } else {
            setStudents(prev => [
                ...prev,
                {
                    ...formData,
                    marks,
                    total,
                    id: Date.now()
                }
            ]);
        }

        resetForm();
    };

    const handleEdit = (student) => {
        setFormData({
            name: student.name,
            rollNo: student.rollNo,
            subject: student.subject,
            marks: String(student.marks),
            total: String(student.total)
        });

        setEditingId(student.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            setStudents(prev =>
                prev.filter(student => student.id !== id)
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Marks Management
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Add students and manage their academic performance.
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
                >
                    <Plus size={20} />
                    Add Student
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-slate-500 text-sm">Total Students</p>
                            <h2 className="text-3xl font-bold mt-2">
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
                            <h2 className="text-3xl font-bold mt-2">
                                {averageMarks}%
                            </h2>
                        </div>
                        <TrendingUp size={28} className="text-green-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-slate-500 text-sm">Subjects</p>
                            <h2 className="text-3xl font-bold mt-2">
                                {subjects}
                            </h2>
                        </div>
                        <GraduationCap size={28} className="text-purple-600" />
                    </div>
                </div>

            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800">
                            {editingId ? "Edit Student Marks" : "Add New Student"}
                        </h2>

                        <button onClick={resetForm}>
                            <X size={22} className="text-slate-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Student Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter student name"
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Roll Number
                                </label>
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleChange}
                                    placeholder="Enter roll number"
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Enter subject"
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Obtained Marks
                                </label>
                                <input
                                    type="number"
                                    name="marks"
                                    value={formData.marks}
                                    onChange={handleChange}
                                    placeholder="Enter obtained marks"
                                    min="0"
                                    step="any"
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Total Marks
                                </label>
                                <input
                                    type="number"
                                    name="total"
                                    value={formData.total}
                                    onChange={handleChange}
                                    min="1"
                                    step="any"
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                            >
                                <Save size={18} />
                                {editingId ? "Update Student" : "Save Student"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-sm border p-6">

                <h2 className="text-xl font-bold text-slate-800 mb-6">
                    Student Marks
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">

                        <thead>
                            <tr className="border-b text-slate-500 text-sm">
                                <th className="py-4">Roll No</th>
                                <th className="py-4">Student Name</th>
                                <th className="py-4">Subject</th>
                                <th className="py-4">Marks</th>
                                <th className="py-4">Grade</th>
                                <th className="py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.length > 0 ? (
                                students.map(student => (
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

                                        <td className="py-4 font-medium">
                                            {student.marks} / {student.total}
                                        </td>

                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGrade(student.marks, student.total) === "F"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}>
                                                {getGrade(student.marks, student.total)}
                                            </span>
                                        </td>

                                        <td className="py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Pencil size={19} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={19} />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-12">
                                        <GraduationCap
                                            size={40}
                                            className="mx-auto text-slate-300 mb-3"
                                        />
                                        <p className="text-slate-500 font-medium">
                                            No students added yet.
                                        </p>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Click Add Student to enter student marks.
                                        </p>
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

export default Marks;
