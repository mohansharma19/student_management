
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";

const API = "http://localhost:5000/api";
const STUDENT_URL = `${API}/students`;
const REPORT_URL = `${API}/daily-reports`;

const initialForm = {
  student: "",
  date: "",
  attendance: "Present",
  homework: "",
  description: "",
  status: "Pending",
  subject: "",
  score: "",
  totalMarks: "",
  teacherRemarks: "",
};

const DailyReport = () => {
  const [form, setForm] = useState(initialForm);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch actual students and daily reports
  const fetchData = useCallback(async () => {
    setFetching(true);
    setError("");

    try {
      const config = getConfig();

      if (!config.headers.Authorization || config.headers.Authorization === "Bearer null") {
        throw new Error("Token not found. Please login again.");
      }

      const [studentRes, reportRes] = await Promise.all([
        axios.get(STUDENT_URL, config),
        axios.get(REPORT_URL, config),
      ]);

      // Actual student data from Student collection
      setStudents(studentRes.data.students || []);

      // Daily reports
      setReports(
        reportRes.data.reports ||
        reportRes.data.data ||
        []
      );

    } catch (err) {
      console.error("Fetch error:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch data."
      );
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Reset form
  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  // Create and update report
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.student ||
      !form.date ||
      !form.homework.trim() ||
      !form.description.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (
      (form.score !== "" && Number(form.score) < 0) ||
      (form.totalMarks !== "" && Number(form.totalMarks) < 1)
    ) {
      setError("Please enter valid academic marks.");
      return;
    }

    if (
      form.score !== "" &&
      form.totalMarks !== "" &&
      Number(form.score) > Number(form.totalMarks)
    ) {
      setError("Score cannot exceed total marks.");
      return;
    }

    if (
      (form.score !== "" && form.totalMarks === "") ||
      (form.score === "" && form.totalMarks !== "")
    ) {
      setError("Enter both score and total marks.");
      return;
    }

    setLoading(true);

    try {
      const config = getConfig();

      const payload = {
        student: form.student,
        date: form.date,
        attendance: form.attendance,
        homework: form.homework.trim(),
        description: form.description.trim(),
        status: form.status,
        teacherRemarks: form.teacherRemarks.trim(),
      };

      if (
        form.subject.trim() ||
        form.score !== "" ||
        form.totalMarks !== ""
      ) {
        payload.academicPerformance = {
          subject: form.subject.trim(),
          score: form.score === "" ? undefined : Number(form.score),
          totalMarks:
            form.totalMarks === ""
              ? undefined
              : Number(form.totalMarks),
        };
      }

      if (editId) {
        await axios.put(
          `${REPORT_URL}/${editId}`,
          payload,
          config
        );

        setSuccess("Daily report updated successfully!");
      } else {
        await axios.post(
          REPORT_URL,
          payload,
          config
        );

        setSuccess("Daily report created successfully!");
      }

      resetForm();
      await fetchData();

    } catch (err) {
      console.error("Submit error:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
        "Failed to save daily report."
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit report
  const handleEdit = (report) => {
    setEditId(report._id);

    setForm({
      student: report.student?._id || report.student || "",
      date: report.date
        ? new Date(report.date).toISOString().split("T")[0]
        : "",
      attendance: report.attendance || "Present",
      homework: report.homework || "",
      description: report.description || "",
      status: report.status || "Pending",
      subject: report.academicPerformance?.subject || "",
      score: report.academicPerformance?.score ?? "",
      totalMarks: report.academicPerformance?.totalMarks ?? "",
      teacherRemarks: report.teacherRemarks || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete report
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await axios.delete(
        `${REPORT_URL}/${id}`,
        getConfig()
      );

      setReports((prev) =>
        prev.filter((report) => report._id !== id)
      );

      setSuccess("Report deleted successfully!");

      if (editId === id) {
        resetForm();
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to delete report."
      );
    }
  };

  // Get actual student name from populated User
  const getStudentName = (student) => {
    if (!student) return "Student";

    const studentId =
      typeof student === "object" ? student._id : student;

    // Populated student object se name
    if (typeof student === "object" && student.user?.name) {
      return student.user.name;
    }

    // Students list se actual name find karo
    const foundStudent = students.find(
      (s) => s._id === studentId
    );

    return foundStudent?.user?.name || "Student";
  };
  const getAttendanceStyle = (status) => {
    const styles = {
      Present: "bg-green-100 text-green-700",
      Absent: "bg-red-100 text-red-700",
      Late: "bg-yellow-100 text-yellow-700",
      Leave: "bg-blue-100 text-blue-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusStyle = (status) => {
    const styles = {
      Submitted: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      NotSubmitted: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <ClipboardList size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                Daily Student Report
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage attendance, homework and academic performance.
              </p>
            </div>
          </div>

          <button
            onClick={fetchData}
            disabled={fetching}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Form */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {editId ? "Update Report" : "Create New Report"}
            </h2>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1 text-sm text-red-500"
              >
                <X size={17} />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Student and Date */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select Student *
                </label>

                <select
                  name="student"
                  value={form.student}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-blue-500"
                >
                  <option value="">Choose Student</option>

                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.user?.name || "Unknown Student"} - Roll: {student.rollNumber} - Class: {student.className}
                    </option>
                  ))}
                </select>

                {students.length === 0 && !fetching && (
                  <p className="mt-1 text-xs text-red-500">
                    No students found. Check student API and admin access.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Report Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Attendance and Homework Status */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Attendance *
                </label>

                <select
                  name="attendance"
                  value={form.attendance}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-3"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Homework Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-3"
                >
                  <option value="Pending">Pending</option>
                  <option value="Submitted">Submitted</option>
                  <option value="NotSubmitted">Not Submitted</option>
                </select>
              </div>
            </div>

            {/* Homework */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Homework *
              </label>

              <input
                name="homework"
                value={form.homework}
                onChange={handleChange}
                required
                placeholder="Enter homework title"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Enter homework details..."
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Academic Performance */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-4 font-bold text-gray-800">
                Academic Performance
              </h3>

              <div className="grid gap-5 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Subject
                  </label>

                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Mathematics"
                    className="w-full rounded-lg border border-gray-300 bg-white p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Score
                  </label>

                  <input
                    type="number"
                    name="score"
                    value={form.score}
                    onChange={handleChange}
                    min="0"
                    placeholder="Obtained marks"
                    className="w-full rounded-lg border border-gray-300 bg-white p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Total Marks
                  </label>

                  <input
                    type="number"
                    name="totalMarks"
                    value={form.totalMarks}
                    onChange={handleChange}
                    min="1"
                    placeholder="Total marks"
                    className="w-full rounded-lg border border-gray-300 bg-white p-3"
                  />
                </div>
              </div>
            </div>

            {/* Teacher Remarks */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Teacher Remarks
              </label>

              <textarea
                name="teacherRemarks"
                value={form.teacherRemarks}
                onChange={handleChange}
                rows={3}
                placeholder="Write teacher remarks..."
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            {/* Submit */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading || students.length === 0}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={19} />
                {loading
                  ? "Please wait..."
                  : editId
                    ? "Update Report"
                    : "Create Report"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border px-6 py-3 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Reports Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
            <h2 className="text-xl font-bold text-gray-800">
              All Daily Reports
            </h2>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Total: {reports.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm">

              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4">Homework</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Performance</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {fetching ? (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-gray-500">
                      Loading reports...
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-gray-500">
                      No daily reports found.
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">

                      <td className="p-4 font-medium text-gray-800">
                        {getStudentName(report.student)}
                      </td>

                      <td className="p-4">
                        {new Date(report.date).toLocaleDateString("en-IN")}
                      </td>

                      <td className="p-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getAttendanceStyle(report.attendance)}`}>
                          {report.attendance}
                        </span>
                      </td>

                      <td className="max-w-48 truncate p-4">
                        {report.homework}
                      </td>

                      <td className="p-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(report.status)}`}>
                          {report.status}
                        </span>
                      </td>

                      <td className="p-4">
                        {report.academicPerformance?.score !== undefined
                          ? `${report.academicPerformance.score}/${report.academicPerformance.totalMarks ?? "-"}`
                          : "N/A"}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() => handleEdit(report)}
                            className="rounded-lg bg-yellow-100 p-2 text-yellow-700 hover:bg-yellow-200"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(report._id)}
                            className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DailyReport;
