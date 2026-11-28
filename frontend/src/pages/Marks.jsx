import { useEffect, useMemo, useState } from "react";
import {
    GraduationCap,
    Users,
    TrendingUp,
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
} from "lucide-react";
import API from "../services/api";

const getAuthHeaders = () => {
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

    return token ? { Authorization: `Bearer ${token}` } : {};
};

const initialForm = {
    student: "",
    subject: "",
    exam: "",
    obtainedMarks: "",
    totalMarks: "100",
    academicYear: "",
    remarks: "",
};

const Marks = () => {
    const [students, setStudents] = useState([]);
    const [marksList, setMarksList] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Fetch students and marks
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const headers = getAuthHeaders();

            const [studentResponse, marksResponse] = await Promise.all([
                API.get("/students", { headers }),
                API.get("/marks", { headers }),
            ]);

            setStudents(studentResponse.data.students || []);
            setMarksList(marksResponse.data.marks || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load marks data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Student lookup
    const getStudent = (studentId) => {
        return students.find(
            (student) => student._id === studentId
        );
    };

    const getStudentName = (mark) => {
        const studentId =
            typeof mark.student === "object"
                ? mark.student?._id
                : mark.student;

        const student = getStudent(studentId);

        return (
            student?.user?.name ||
            mark.student?.user?.name ||
            "Unknown Student"
        );
    };

    const getRollNumber = (mark) => {
        const studentId =
            typeof mark.student === "object"
                ? mark.student?._id
                : mark.student;

        const student = getStudent(studentId);

        return (
            student?.rollNumber ||
            mark.student?.rollNumber ||
            "-"
        );
    };

    // Statistics
    const averageMarks = useMemo(() => {
        if (!marksList.length) return 0;

        const totalPercentage = marksList.reduce(
            (sum, item) =>
                sum +
                (Number(item.obtainedMarks) /
                    Number(item.totalMarks)) * 100,
            0
        );

        return Math.round(totalPercentage / marksList.length);
    }, [marksList]);

    const totalStudents = useMemo(() => {
        return new Set(
            marksList.map((item) =>
                typeof item.student === "object"
                    ? item.student?._id
                    : item.student
            )
        ).size;
    }, [marksList]);

    const subjects = useMemo(() => {
        return new Set(
            marksList.map((item) => item.subject)
        ).size;
    }, [marksList]);

    // Grade calculation
    const getGrade = (obtained, total) => {
        const percentage = (obtained / total) * 100;

        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 40) return "D";
        if (percentage >= 33) return "E";

        return "F";
    };

    // Form change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Reset form
    const resetForm = () => {
        setFormData(initialForm);
        setEditingId(null);
        setShowForm(false);
    };

    // Add / Update marks
    const handleSubmit = async (e) => {
        e.preventDefault();

        const obtained = Number(formData.obtainedMarks);
        const total = Number(formData.totalMarks);

        if (
            !formData.student ||
            !formData.subject.trim() ||
            !formData.exam.trim() ||
            !formData.academicYear.trim() ||
            formData.obtainedMarks === "" ||
            !Number.isFinite(obtained) ||
            !Number.isFinite(total) ||
            total <= 0 ||
            obtained < 0 ||
            obtained > total
        ) {
            alert("Please enter valid marks details.");
            return;
        }

        const payload = {
            student: formData.student,
            subject: formData.subject.trim(),
            exam: formData.exam.trim(),
            totalMarks: total,
            obtainedMarks: obtained,
            academicYear: formData.academicYear.trim(),
            remarks: formData.remarks.trim(),
        };

        try {
            setSaving(true);
            setError("");

            const headers = getAuthHeaders();

            if (editingId) {
                await API.put(
                    `/marks/${editingId}`,
                    payload,
                    { headers }
                );
            } else {
                await API.post(
                    "/marks",
                    payload,
                    { headers }
                );
            }

            await fetchData();
            resetForm();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save marks."
            );
        } finally {
            setSaving(false);
        }
    };

    // Edit marks
    const handleEdit = (item) => {
        const studentId =
            typeof item.student === "object"
                ? item.student?._id
                : item.student;

        setFormData({
            student: studentId || "",
            subject: item.subject || "",
            exam: item.exam || "",
            obtainedMarks: String(item.obtainedMarks ?? ""),
            totalMarks: String(item.totalMarks ?? 100),
            academicYear: item.academicYear || "",
            remarks: item.remarks || "",
        });

        setEditingId(item._id);
        setShowForm(true);
    };

    // Delete marks
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete these marks?")) {
            return;
        }

        try {
            setError("");

            await API.delete(`/marks/${id}`, {
                headers: getAuthHeaders(),
            });

            await fetchData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete marks."
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
                        Manage student academic performance.
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
                    Add Marks
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-6">
                    {error}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-slate-500 text-sm">
                                Total Students
                            </p>
                            <h2 className="text-3xl font-bold mt-2">
                                {totalStudents}
                            </h2>
                        </div>
                        <Users size={28} className="text-blue-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-slate-500 text-sm">
                                Average Marks
                            </p>
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
                            <p className="text-slate-500 text-sm">
                                Subjects
                            </p>
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
                            {editingId ? "Edit Marks" : "Add New Marks"}
                        </h2>

                        <button onClick={resetForm}>
                            <X size={22} className="text-slate-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Student
                                </label>

                                <select
                                    name="student"
                                    value={formData.student}
                                    onChange={handleChange}
                                    disabled={Boolean(editingId)}
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500 disabled:bg-slate-100"
                                    required
                                >
                                    <option value="">Select Student</option>

                                    {students.map((student) => (
                                        <option
                                            key={student._id}
                                            value={student._id}
                                        >
                                            {student.user?.name || "Unnamed"} - {student.rollNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Subject
                                </label>
                                <input
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="e.g. Mathematics"
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Exam
                                </label>
                                <input
                                    name="exam"
                                    value={formData.exam}
                                    onChange={handleChange}
                                    placeholder="e.g. Mid Term"
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
                                    name="obtainedMarks"
                                    value={formData.obtainedMarks}
                                    onChange={handleChange}
                                    min="0"
                                    step="any"
                                    placeholder="Enter obtained marks"
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
                                    name="totalMarks"
                                    value={formData.totalMarks}
                                    onChange={handleChange}
                                    min="1"
                                    step="any"
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Academic Year
                                </label>
                                <input
                                    name="academicYear"
                                    value={formData.academicYear}
                                    onChange={handleChange}
                                    placeholder="e.g. 2026-2027"
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="block text-sm font-medium mb-2">
                                    Remarks
                                </label>
                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    placeholder="Optional remarks"
                                    rows="3"
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                            >
                                <Save size={18} />
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Marks"
                                        : "Save Marks"}
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

            {/* Marks Table */}
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
                                <th className="py-4">Exam</th>
                                <th className="py-4">Marks</th>
                                <th className="py-4">Grade</th>
                                <th className="py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-slate-500">
                                        Loading marks...
                                    </td>
                                </tr>
                            ) : marksList.length > 0 ? (
                                marksList.map((item) => (
                                    <tr
                                        key={item._id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="py-4 text-slate-600">
                                            {getRollNumber(item)}
                                        </td>

                                        <td className="py-4 font-medium text-slate-800">
                                            {getStudentName(item)}
                                        </td>

                                        <td className="py-4 text-slate-600">
                                            {item.subject}
                                        </td>

                                        <td className="py-4 text-slate-600">
                                            {item.exam}
                                        </td>

                                        <td className="py-4 font-medium">
                                            {item.obtainedMarks} / {item.totalMarks}
                                        </td>

                                        <td className="py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    getGrade(
                                                        item.obtainedMarks,
                                                        item.totalMarks
                                                    ) === "F"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {getGrade(
                                                    item.obtainedMarks,
                                                    item.totalMarks
                                                )}
                                            </span>
                                        </td>

                                        <td className="py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Pencil size={19} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(item._id)}
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
                                    <td colSpan="7" className="text-center py-12">
                                        <GraduationCap
                                            size={40}
                                            className="mx-auto text-slate-300 mb-3"
                                        />
                                        <p className="text-slate-500 font-medium">
                                            No marks added yet.
                                        </p>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Click Add Marks to enter student marks.
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