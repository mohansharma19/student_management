const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Homework = require("../models/Homework");
const HomeworkSubmission = require("../models/HomeworkSubmission");
const Marks = require("../models/Marks");

// ======================================
// ADMIN DASHBOARD
// ======================================
const getAdminDashboard = async (req, res) => {
    try {
        // 1. STUDENT STATISTICS

        const totalStudents = await Student.countDocuments();

        // Count unique classes
        const totalClasses = await Student.distinct("className");

        // Students admitted in the last 30 days
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const recentAdmissions = await Student.countDocuments({
            admissionDate: { $gte: last30Days },
        });

        // 2. ATTENDANCE STATISTICS

        const attendanceStats = await Attendance.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const attendance = {
            totalPresent: 0,
            totalAbsent: 0,
            totalLate: 0,
            totalLeave: 0,
        };

        attendanceStats.forEach((item) => {
            if (item._id === "Present") attendance.totalPresent = item.count;
            if (item._id === "Absent") attendance.totalAbsent = item.count;
            if (item._id === "Late") attendance.totalLate = item.count;
            if (item._id === "Leave") attendance.totalLeave = item.count;
        });

        // Leave records are excluded from the attendance percentage.
        const attendanceCount =
            attendance.totalPresent +
            attendance.totalAbsent +
            attendance.totalLate;

        const attendancePercentage =
            attendanceCount > 0
                ? Number(
                    ((attendance.totalPresent / attendanceCount) * 100).toFixed(2)
                )
                : 0;

        // 3. HOMEWORK STATISTICS

        const totalHomework = await Homework.countDocuments();

        const activeHomework = await Homework.countDocuments({
            status: "Active",
        });

        // 4. HOMEWORK SUBMISSION STATISTICS

        const totalSubmissions = await HomeworkSubmission.countDocuments();

        const pendingSubmissions = await HomeworkSubmission.countDocuments({
            status: { $in: ["Submitted", "Late"] },
        });

        const reviewedSubmissions = await HomeworkSubmission.countDocuments({
            status: "Reviewed",
        });

        // 5. MARKS STATISTICS

        const totalMarksRecords = await Marks.countDocuments();

        const marksResult = await Marks.aggregate([
            {
                $group: {
                    _id: null,
                    averagePercentage: {
                        $avg: {
                            $multiply: [
                                {
                                    $divide: [
                                        "$obtainedMarks",
                                        "$totalMarks",
                                    ],
                                },
                                100,
                            ],
                        },
                    },
                },
            },
        ]);

        const averagePercentage =
            marksResult.length > 0
                ? Number(marksResult[0].averagePercentage.toFixed(2))
                : 0;

        // 6. RECENT ACTIVITIES

        const recentStudents = await Student.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email");

        const recentHomework = await Homework.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title subject className section createdAt");

        const recentSubmissions = await HomeworkSubmission.find()
            .sort({ submittedAt: -1 })
            .limit(5)
            .populate("student", "rollNumber")
            .populate("homework", "title");

        // 7. SEND RESPONSE

        return res.status(200).json({
            success: true,
            message: "Admin dashboard data fetched successfully",

            data: {
                studentStats: {
                    totalStudents,
                    totalClasses: totalClasses.length,
                    recentAdmissions,
                },

                attendanceStats: {
                    ...attendance,
                    attendancePercentage,
                },

                homeworkStats: {
                    totalHomework,
                    activeHomework,
                    totalSubmissions,
                    pendingSubmissions,
                    reviewedSubmissions,
                },

                marksStats: {
                    totalMarksRecords,
                    averagePercentage,
                },

                recentActivities: {
                    recentStudents,
                    recentHomework,
                    recentSubmissions,
                },
            },
        });

    } catch (error) {
        console.error("Admin Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin dashboard data",
            error: error.message,
        });
    }
};

module.exports = {
    getAdminDashboard,
};