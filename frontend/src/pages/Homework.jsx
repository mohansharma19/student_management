import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const initialForm = {
    title: "",
    description: "",
    subject: "",
    className: "",
    section: "",
    assignedDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    attachment: "",
};

const getErrorMessage = (error) =>
    error.response?.data?.message || "Something went wrong!";

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
};

export default function Homework() {
    const [homework, setHomework] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [classFilter, setClassFilter] = useState("All");

    const [showForm, setShowForm] = useState(false);

    // Fetch all homework
    const fetchHomework = async () => {
        try {
            setLoading(true);

            const response = await API.get("/homework");

            setHomework(response.data.homework || []);
        } catch (error) {
            alert(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomework();
    }, []);

    // Handle input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Reset form
    const resetForm = () => {
        setForm({
            ...initialForm,
            assignedDate: new Date().toISOString().split("T")[0],
        });

        setEditingId(null);
        setShowForm(false);
    };

    // Add / Update homework
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (new Date(form.dueDate) < new Date(form.assignedDate)) {
            alert("Due date cannot be before assigned date");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...form,
                attachment: form.attachment.trim() || null,
            };

            if (editingId) {
                await API.put(`/homework/${editingId}`, payload);
                alert("Homework updated successfully!");
            } else {
                await API.post("/homework", payload);
                alert("Homework created successfully!");
            }

            resetForm();
            fetchHomework();
        } catch (error) {
            alert(getErrorMessage(error));
        } finally {
            setSaving(false);
        }
    };

    // Edit homework
    const handleEdit = (item) => {
        setForm({
            title: item.title || "",
            description: item.description || "",
            subject: item.subject || "",
            className: item.className || "",
            section: item.section || "",
            assignedDate: item.assignedDate
                ? new Date(item.assignedDate).toISOString().split("T")[0]
                : "",
            dueDate: item.dueDate
                ? new Date(item.dueDate).toISOString().split("T")[0]
                : "",
            attachment: item.attachment || "",
        });

        setEditingId(item._id);
        setShowForm(true);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Delete homework
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this homework?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/homework/${id}`);

            setHomework((prev) =>
                prev.filter((item) => item._id !== id)
            );

            alert("Homework deleted successfully!");
        } catch (error) {
            alert(getErrorMessage(error));
        }
    };

    // Change status
    const handleStatusChange = async (item, status) => {
        try {
            const response = await API.put(`/homework/${item._id}`, {
                status,
            });

            const updatedHomework = response.data.homework;

            setHomework((prev) =>
                prev.map((hw) =>
                    hw._id === item._id ? updatedHomework : hw
                )
            );
        } catch (error) {
            alert(getErrorMessage(error));
        }
    };

    // Filter homework
    const filteredHomework = useMemo(() => {
        return homework.filter((item) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                item.title?.toLowerCase().includes(searchText) ||
                item.subject?.toLowerCase().includes(searchText) ||
                item.className?.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "All" ||
                item.status === statusFilter;

            const matchesClass =
                classFilter === "All" ||
                item.className === classFilter;

            return matchesSearch && matchesStatus && matchesClass;
        });
    }, [homework, search, statusFilter, classFilter]);

    const classes = [
        ...new Set(homework.map((item) => item.className).filter(Boolean)),
    ];

    const activeCount = homework.filter(
        (item) => item.status === "Active"
    ).length;

    const completedCount = homework.filter(
        (item) => item.status === "Completed"
    ).length;

    const expiredCount = homework.filter(
        (item) => item.status === "Expired"
    ).length;

    const statusStyle = {
        Active: "bg-green-100 text-green-700",
        Completed: "bg-blue-100 text-blue-700",
        Expired: "bg-red-100 text-red-700",
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">

            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Homework Management
                    </h1>
                    <p className="mt-1 text-gray-500">
                        Create, manage and track student homework
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setEditingId(null);
                            setForm({
                                ...initialForm,
                                assignedDate: new Date()
                                    .toISOString()
                                    .split("T")[0],
                            });
                            setShowForm(true);
                        }
                    }}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    {showForm ? "Close Form" : "+ Add Homework"}
                </button>
            </div>

            {/* Statistics */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Homework</p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-800">
                        {homework.length}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Active</p>
                    <h2 className="mt-2 text-3xl font-bold text-green-600">
                        {activeCount}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Completed</p>
                    <h2 className="mt-2 text-3xl font-bold text-blue-600">
                        {completedCount}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Expired</p>
                    <h2 className="mt-2 text-3xl font-bold text-red-600">
                        {expiredCount}
                    </h2>
                </div>

            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-6 text-xl font-bold text-gray-800">
                        {editingId ? "Edit Homework" : "Create New Homework"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Homework Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter homework title"
                                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter subject"
                                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Class *
                                </label>
                                <input
                                    type="text"
                                    name="className"
                                    value={form.className}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 10"
                                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Section *
                                </label>
                                <input
                                    type="text"
                                    name="section"
                                    value={form.section}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. A"
                                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Assigned Date
                                </label>
                                <input
                                    type="date"
                                    name="assignedDate"
                                    value={form.assignedDate}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Due Date *
                                </label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={form.dueDate}
                                    onChange={handleChange}
                                    required
                                    min={form.assignedDate}
                                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                placeholder="Write homework instructions..."
                                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Attachment URL (Optional)
                            </label>
                            <input
                                type="url"
                                name="attachment"
                                value={form.attachment}
                                onChange={handleChange}
                                placeholder="https://example.com/file.pdf"
                                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Homework"
                                        : "Create Homework"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            )}

            {/* Homework List */}
            <div className="rounded-xl bg-white p-5 shadow-sm">

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        All Homework
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all assigned homework
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search homework..."
                        className="rounded-lg border p-3 outline-none focus:border-blue-500"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border p-3 outline-none focus:border-blue-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Expired">Expired</option>
                    </select>

                    <select
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        className="rounded-lg border p-3 outline-none focus:border-blue-500"
                    >
                        <option value="All">All Classes</option>
                        {classes.map((className) => (
                            <option key={className} value={className}>
                                Class {className}
                            </option>
                        ))}
                    </select>

                </div>

                {/* Table */}
                {loading ? (
                    <div className="py-12 text-center text-gray-500">
                        Loading homework...
                    </div>
                ) : filteredHomework.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">
                        No homework found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px] text-left">

                            <thead className="bg-gray-50 text-sm text-gray-600">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Subject</th>
                                    <th className="p-4">Class</th>
                                    <th className="p-4">Assigned</th>
                                    <th className="p-4">Due Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">

                                {filteredHomework.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50">

                                        <td className="p-4">
                                            <p className="font-semibold text-gray-800">
                                                {item.title}
                                            </p>

                                            <p className="mt-1 max-w-[220px] truncate text-sm text-gray-500">
                                                {item.description}
                                            </p>

                                            {item.attachment && (
                                                <a
                                                    href={item.attachment}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-1 inline-block text-sm text-blue-600 hover:underline"
                                                >
                                                    View Attachment
                                                </a>
                                            )}
                                        </td>

                                        <td className="p-4 text-gray-700">
                                            {item.subject}
                                        </td>

                                        <td className="p-4 text-gray-700">
                                            {item.className} - {item.section}
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {formatDate(item.assignedDate)}
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {formatDate(item.dueDate)}
                                        </td>

                                        <td className="p-4">
                                            <select
                                                value={item.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        item,
                                                        e.target.value
                                                    )
                                                }
                                                className={`rounded-full px-3 py-1 text-xs font-semibold outline-none ${statusStyle[item.status] ||
                                                    "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Expired">Expired</option>
                                            </select>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="rounded-md bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-200"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(item._id)
                                                    }
                                                    className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table>

                    </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                    Showing {filteredHomework.length} of {homework.length} homework records
                </div>

            </div>

        </div>
    );
}
