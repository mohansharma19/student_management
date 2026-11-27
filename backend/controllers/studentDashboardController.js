
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Homework = require("../models/Homework");
const HomeworkSubmission = require("../models/HomeworkSubmission");
const DailyReport = require("../models/DailyReport");

// STUDENT DASHBOARD
const getStudentDashboard = async (req, res) => {
    try {
        // Find student linked to logged-in user
        const student = await Student.findOne({
            user: req.user.id,
        }).populate("user", "name email phone profileImage");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found",
                userId: req.user.id,
            });
        }

        // Student ID
        const studentId = student._id;

        // 1. ATTENDANCE STATISTICS
        const attendanceRecords = await Attendance.find({
            student: studentId,
        });

        const attendanceStats = {
            totalPresent: 0,
            totalAbsent: 0,
            totalLate: 0,
            totalLeave: 0,
        };

        attendanceRecords.forEach((record) => {
            if (record.status === "Present") attendanceStats.totalPresent++;
            if (record.status === "Absent") attendanceStats.totalAbsent++;
            if (record.status === "Late") attendanceStats.totalLate++;
            if (record.status === "Leave") attendanceStats.totalLeave++;
        });

        const countedAttendance =
            attendanceStats.totalPresent +
            attendanceStats.totalAbsent +
            attendanceStats.totalLate;

        const attendancePercentage =
            countedAttendance > 0
                ? Number(
                    (
                        (attendanceStats.totalPresent / countedAttendance) * 100
                    ).toFixed(2)
                )
                : 0;

        // 2. STUDENT MARKS
        const marks = await Marks.find({
            student: studentId,
        }).sort({ createdAt: -1 });

        // 3. HOMEWORK
        const homework = await Homework.find({
            className: student.className,
            section: student.section,
            status: "Active",
        }).sort({ dueDate: 1 });

        // 4. HOMEWORK SUBMISSIONS
        const submissions = await HomeworkSubmission.find({
            student: studentId,
        }).populate("homework", "title subject dueDate");

        const submittedHomeworkIds = submissions
            .filter((submission) => submission.homework)
            .map((submission) => submission.homework._id.toString());

        const pendingHomework = homework.filter(
            (item) => !submittedHomeworkIds.includes(item._id.toString())
        );

        // 5. RECENT DAILY REPORTS
        const dailyReports = await DailyReport.find({
            student: studentId,
        })
            .sort({ date: -1 })
            .limit(5);

        // 6. RESPONSE
        return res.status(200).json({
            success: true,
            message: "Student dashboard data fetched successfully",
            data: {
                studentProfile: student,
                attendanceStats: {
                    ...attendanceStats,
                    attendancePercentage,
                },
                marks,
                homeworkStats: {
                    totalHomework: homework.length,
                    pendingHomework: pendingHomework.length,
                    submittedHomework: submissions.length,
                },
                pendingHomework,
                submissions,
                dailyReports,
            },
        });

    } catch (error) {
        console.error("Student Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch student dashboard data",
            error: error.message,
        });
    }
};

module.exports = {
    getStudentDashboard,
};
