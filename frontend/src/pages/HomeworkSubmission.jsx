import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const HomeworkSubmission = () => {
    const [homeworks, setHomeworks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        submissionText: "",
        attachment: "",
    });

    const [selectedHomework, setSelectedHomework] = useState(null);

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Fetch homework and previous submissions
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [homeworkRes, submissionRes] = await Promise.all([
                axios.get(`${API}/homework`, config),
                axios.get(`${API}/homework-submissions/my`, config),
            ]);

            setHomeworks(
                homeworkRes.data.homeworks ||
                homeworkRes.data.data ||
                []
            );

            setSubmissions(
                submissionRes.data.submissions || []
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch homework"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Open submission form
    const openSubmissionForm = (homeworkId) => {
        setSelectedHomework(homeworkId);

        setFormData({
            submissionText: "",
            attachment: "",
        });

        setMessage("");
        setError("");
    };

    // Submit homework
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedHomework) return;

        if (
            !formData.submissionText.trim() &&
            !formData.attachment.trim()
        ) {
            setError("Please enter text or attachment URL");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setMessage("");

            const response = await axios.post(
                `${API}/homework-submissions/${selectedHomework}`,
                {
                    submissionText: formData.submissionText,
                    attachment: formData.attachment,
                },
                config
            );

            setMessage(response.data.message);

            setSelectedHomework(null);

            setFormData({
                submissionText: "",
                attachment: "",
            });

            await fetchData();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Homework submission failed"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Find submission for a homework
    const getSubmission = (homeworkId) => {
        return submissions.find(
            (item) => {
                const id =
                    typeof item.homework === "object"
                        ? item.homework?._id
                        : item.homework;

                return id === homeworkId;
            }
        );
    };

    const formatDate = (date) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-semibold text-gray-600">
                    Loading homework...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Homework Submission
                    </h1>

                    <p className="text-gray-500 mt-2">
                        View your homework and submit your assignments.
                    </p>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
                        {message}
                    </div>
                )}

                {/* Homework List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {homeworks.length === 0 ? (
                        <div className="col-span-full bg-white p-8 rounded-xl text-center shadow">
                            <p className="text-gray-500">
                                No homework available.
                            </p>
                        </div>
                    ) : (
                        homeworks.map((homework) => {
                            const submission = getSubmission(homework._id);

                            return (
                                <div
                                    key={homework._id}
                                    className="bg-white rounded-xl shadow-md p-6"
                                >

                                    <div className="flex justify-between items-start gap-3 mb-4">

                                        <h2 className="text-xl font-bold text-gray-800">
                                            {homework.title}
                                        </h2>

                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${submission
                                                ? submission.status === "Late"
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                            }`}>
                                            {submission
                                                ? submission.status
                                                : "Pending"}
                                        </span>

                                    </div>

                                    <p className="text-gray-600 mb-4">
                                        {homework.description}
                                    </p>

                                    <div className="space-y-2 text-sm text-gray-600 mb-5">

                                        <p>
                                            <strong>Subject:</strong>{" "}
                                            {homework.subject}
                                        </p>

                                        <p>
                                            <strong>Due Date:</strong>{" "}
                                            {formatDate(homework.dueDate)}
                                        </p>

                                        {homework.totalMarks !== undefined && (
                                            <p>
                                                <strong>Total Marks:</strong>{" "}
                                                {homework.totalMarks}
                                            </p>
                                        )}

                                    </div>

                                    {/* Submission Details */}
                                    {submission ? (
                                        <div className="border-t pt-4">

                                            <p className="text-green-700 font-semibold mb-2">
                                                Homework Submitted
                                            </p>

                                            <p className="text-sm text-gray-600">
                                                Submitted on:{" "}
                                                {formatDate(submission.submittedAt)}
                                            </p>

                                            {submission.marksObtained !== null && (
                                                <p className="text-sm mt-2">
                                                    <strong>Marks:</strong>{" "}
                                                    {submission.marksObtained}
                                                </p>
                                            )}

                                            {submission.feedback && (
                                                <p className="text-sm mt-2">
                                                    <strong>Feedback:</strong>{" "}
                                                    {submission.feedback}
                                                </p>
                                            )}

                                            {submission.attachment && (
                                                <a
                                                    href={submission.attachment}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 underline text-sm block mt-2"
                                                >
                                                    View Attachment
                                                </a>
                                            )}

                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => openSubmissionForm(homework._id)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                                        >
                                            Submit Homework
                                        </button>
                                    )}

                                </div>
                            );
                        })
                    )}

                </div>

                {/* Submission Form */}
                {selectedHomework && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">

                        <div className="bg-white rounded-xl p-6 w-full max-w-lg">

                            <div className="flex justify-between items-center mb-5">

                                <h2 className="text-xl font-bold text-gray-800">
                                    Submit Your Homework
                                </h2>

                                <button
                                    onClick={() => setSelectedHomework(null)}
                                    className="text-gray-500 hover:text-red-500 text-2xl"
                                >
                                    &times;
                                </button>

                            </div>

                            <form onSubmit={handleSubmit}>

                                <label className="block font-semibold text-gray-700 mb-2">
                                    Submission Text
                                </label>

                                <textarea
                                    name="submissionText"
                                    value={formData.submissionText}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Write your homework answer..."
                                    className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                />

                                <label className="block font-semibold text-gray-700 mb-2">
                                    Attachment URL (Optional)
                                </label>

                                <input
                                    type="url"
                                    name="attachment"
                                    value={formData.attachment}
                                    onChange={handleChange}
                                    placeholder="https://example.com/file.pdf"
                                    className="w-full border rounded-lg p-3 mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
                                />

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Homework"}
                                </button>

                            </form>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default HomeworkSubmission;