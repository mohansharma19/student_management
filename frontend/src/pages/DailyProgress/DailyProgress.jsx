import { useState, useEffect } from "react";
import API from "../../services/api";

const DailyProgress = () => {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );

    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch tasks from backend
    const fetchTasks = async () => {
        try {
            setLoading(true);

            const res = await API.get("/daily-tasks");

            setTasks(res.data.data || []);
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "Failed to fetch tasks"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Add or Update Task
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!taskInput.trim()) return;

        try {
            if (editingId) {
                await API.put(`/daily-tasks/${editingId}`, {
                    title: taskInput.trim(),
                });
                setEditingId(null);
            } else {
                await API.post("/daily-tasks", {
                    title: taskInput.trim(),
                    date: selectedDate,
                });
            }

            setTaskInput("");
            fetchTasks();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to save task"
            );
        }
    };

    // Edit Task
    const handleEdit = (task) => {
        setTaskInput(task.title);
        setEditingId(task._id);
    };

    // Delete Task
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            await API.delete(`/daily-tasks/${id}`);

            if (editingId === id) {
                setEditingId(null);
                setTaskInput("");
            }

            fetchTasks();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete task"
            );
        }
    };

    // Complete / Incomplete Task
    const handleToggle = async (task) => {
        try {
            await API.put(`/daily-tasks/${task._id}`, {
                completed: !task.completed,
            });

            fetchTasks();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to update task"
            );
        }
    };

    // Filter tasks by selected date
    const filteredTasks = tasks.filter(
        (task) => task.date === selectedDate
    );

    const completedTasks = filteredTasks.filter(
        (task) => task.completed
    ).length;

    const totalTasks = filteredTasks.length;

    const progress =
        totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">

            {/* Progress Card */}
            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold">
                    Daily Progress
                </h2>

                <p className="mt-2 text-blue-100">
                    Track your daily study goals
                </p>

                <div className="flex justify-between mt-6 mb-2">
                    <span>Completed Tasks</span>
                    <span>{completedTasks}/{totalTasks}</span>
                </div>

                <div className="w-full bg-blue-400 rounded-full h-3">
                    <div
                        className="bg-white h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <p className="text-right mt-2 font-semibold">
                    {progress}% Completed
                </p>
            </div>

            {/* Date Selection */}
            <div className="bg-white p-5 rounded-xl shadow">
                <label className="block font-semibold mb-2">
                    Select Date
                </label>

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setEditingId(null);
                        setTaskInput("");
                    }}
                    className="border rounded-lg p-3 w-full"
                />
            </div>

            {/* Add Task Form */}
            <div className="bg-white p-5 rounded-xl shadow">

                <h3 className="text-xl font-bold mb-4">
                    {editingId ? "Edit Task" : "Add New Task"}
                </h3>

                <form onSubmit={handleSubmit} className="flex gap-3">

                    <input
                        type="text"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder="Enter your daily task..."
                        className="border rounded-lg p-3 flex-1 min-w-0"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                    >
                        {editingId ? "Update" : "Add"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setTaskInput("");
                            }}
                            className="bg-gray-500 text-white px-4 rounded-lg"
                        >
                            Cancel
                        </button>
                    )}

                </form>
            </div>

            {/* Task List */}
            <div className="bg-white p-5 rounded-xl shadow">

                <h3 className="text-xl font-bold mb-4">
                    Today's Tasks
                </h3>

                {loading ? (
                    <p className="text-center py-6">Loading tasks...</p>
                ) : filteredTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                        No tasks added for this date.
                    </p>
                ) : (
                    <div className="space-y-3">

                        {filteredTasks.map((task) => (
                            <div
                                key={task._id}
                                className="flex flex-wrap items-center justify-between gap-3 border p-4 rounded-lg"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">

                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggle(task)}
                                        className="w-5 h-5"
                                    />

                                    <span
                                        className={`break-words ${task.completed
                                            ? "line-through text-gray-400"
                                            : "text-gray-800"
                                            }`}
                                    >
                                        {task.title}
                                    </span>

                                </div>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() => handleEdit(task)}
                                        className="bg-yellow-500 text-white px-3 py-2 rounded-lg"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="bg-red-600 text-white px-3 py-2 rounded-lg"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>

        </div>
    );
};

export default DailyProgress;