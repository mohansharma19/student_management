
import { useState } from "react";
import {
    Users,
    UserCheck,
    UserX,
    BookOpen,
    Plus,
    ArrowUpRight,
    X
} from "lucide-react";

const AdminDashboard = () => {

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        class: ""
    });

    const [students, setStudents] = useState([
        {
            id: 1,
            name: "Rahul Kumar",
            email: "rahul@gmail.com",
            class: "10th",
            status: "Active"
        },
        {
            id: 2,
            name: "Aman Sharma",
            email: "aman@gmail.com",
            class: "12th",
            status: "Active"
        },
        {
            id: 3,
            name: "Priya Singh",
            email: "priya@gmail.com",
            class: "11th",
            status: "Active"
        },
        {
            id: 4,
            name: "Rohit Verma",
            email: "rohit@gmail.com",
            class: "10th",
            status: "Active"
        },

        {
            id: 5,
            name: "Sneha Sharma ",
            email: "sneha@gmail.com",
            class: "11th",
            status: "Active"
        },
        {
            id: 6,
            name: "Mohit singh",
            email: "Mohit@gmail.com",
            class: "12th",
            status: "Active"
        }
    ]);

    const stats = [
        {
            title: "Total Students",
            value: students.length,
            icon: Users,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Present Today",
            value: "220",
            icon: UserCheck,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Absent Today",
            value: "30",
            icon: UserX,
            color: "bg-red-100 text-red-600"
        },
        {
            title: "Total Classes",
            value: "12",
            icon: BookOpen,
            color: "bg-purple-100 text-purple-600"
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim() ||
            !formData.email.trim() ||
            !formData.class.trim()) {
            alert("Please fill all fields");
            return;
        }

        const newStudent = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            class: formData.class,
            status: "Active"
        };

        setStudents([...students, newStudent]);

        setFormData({
            name: "",
            email: "",
            class: ""
        });

        setShowForm(false);
    };

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

                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add Student
                </button>

            </div>

            {/* Add Student Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-xl font-bold text-slate-800">
                            Add New Student
                        </h2>

                        <button
                            onClick={() => setShowForm(false)}
                            className="text-slate-500 hover:text-red-500"
                        >
                            <X size={22} />
                        </button>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >

                        <input
                            type="text"
                            name="name"
                            placeholder="Student Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            name="class"
                            placeholder="Class (e.g. 10th)"
                            value={formData.class}
                            onChange={handleChange}
                            className="border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-slate-200 text-slate-700 px-5 py-3 rounded-lg hover:bg-slate-300"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                            >
                                Save Student
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

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

            {/* Recent Students */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Recent Students
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Recently added students
                        </p>
                    </div>

                    <button className="text-blue-600 font-medium flex items-center gap-1">
                        View All
                        <ArrowUpRight size={18} />
                    </button>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead>
                            <tr className="border-b text-slate-500 text-sm">
                                <th className="py-4">Student Name</th>
                                <th className="py-4">Email</th>
                                <th className="py-4">Class</th>
                                <th className="py-4">Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {students.map((student) => (
                                <tr
                                    key={student.id}
                                    className="border-b last:border-0"
                                >

                                    <td className="py-4 font-medium text-slate-800">
                                        {student.name}
                                    </td>

                                    <td className="py-4 text-slate-500">
                                        {student.email}
                                    </td>

                                    <td className="py-4 text-slate-600">
                                        {student.class}
                                    </td>

                                    <td className="py-4">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                            {student.status}
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

export default AdminDashboard;
