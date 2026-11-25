import { useState } from "react";

const DailyProgress = () => {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [tasks, setTasks] = useState([]);

    const [taskInput, setTaskInput] = useState("");
    const [editingId, setEditingId] = useState(null);

    // Add and Update Task
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!taskInput.trim()) return;

        if (editingId) {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === editingId
                        ? { ...task, title: taskInput }
                        : task
                )
            );
            setEditingId(null);
        } else {
            const newTask = {
                id: Date.now(),
                title: taskInput,
                completed: false,
                date: selectedDate,
            };

            setTasks((prev) => [...prev, newTask]);
        }

        setTaskInput("");
    };

    // Edit Task
    const handleEdit = (task) => {
        setTaskInput(task.title);
        setEditingId(task.id);
    };

    // Delete Task
    const handleDelete = (id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));

        if (editingId === id) {
            setEditingId(null);
            setTaskInput("");
        }
    };

    // Complete Task
    const handleToggle = (id) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    // Date-wise Tasks
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
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                        Daily Progress Tracker
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Track your daily learning and stay consistent.
                    </p>
                </div>

                {/* Progress Card */}
                <div className="mb-6 rounded-2xl bg-blue-600 p-6 text-white shadow-lg">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>
                            <p className="text-sm text-blue-100">
                                Your Daily Progress
                            </p>

                            <h2 className="mt-2 text-4xl font-bold">
                                {progress}%
                            </h2>

                            <p className="mt-2 text-sm text-blue-100">
                                {completedTasks} of {totalTasks} tasks completed
                            </p>
                        </div>

                        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-blue-300 text-2xl font-bold">
                            {progress}%
                        </div>
                    </div>

                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-blue-400">
                        <div
                            className="h-full rounded-full bg-white transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Date Selection */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-auto"
                    />
                </div>

                {/* Add Task Form */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <h2 className="mb-4 text-lg font-semibold text-slate-800">
                        {editingId ? "Edit Study Task" : "Add New Study Task"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="text"
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            placeholder="What did you study today?"
                            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            {editingId ? "Update Task" : "Add Task"}
                        </button>
                    </form>
                </div>

                {/* Task List */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-800">
                            Today's Tasks
                        </h2>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                            {totalTasks} Tasks
                        </span>
                    </div>

                    {filteredTasks.length === 0 ? (
                        <div className="py-10 text-center">
                            <p className="text-lg font-medium text-slate-600">
                                No tasks added yet!
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                Start by adding what you studied today.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggle(task.id)}
                                        className="h-5 w-5 cursor-pointer accent-blue-600"
                                    />

                                    <p
                                        className={`min-w-0 flex-1 break-words text-sm font-medium ${task.completed
                                                ? "text-slate-400 line-through"
                                                : "text-slate-700"
                                            }`}
                                    >
                                        {task.title}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(task)}
                                            className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-100"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
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
        </div>
    );
};

export default DailyProgress;