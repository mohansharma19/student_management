
const HomeworkSubmission = require("../models/HomeworkSubmission");
const Homework = require("../models/Homework");
const Student = require("../models/Student");
const mongoose = require("mongoose");

// Get logged-in user ID
const getUserId = (req) => {
    return req.user?._id || req.user?.id || null;
};

// Check teacher/admin access
const isTeacherOrAdmin = (user) => {
    return ["admin", "teacher"].includes(
        user?.role?.toLowerCase()
    );
};

// Find student profile linked to logged-in user
const getStudentProfile = async (req) => {
    const userId = getUserId(req);

    if (!userId) return null;

    return await Student.findOne({ user: userId });
};

// 1. SUBMIT HOMEWORK
const submitHomework = async (req, res) => {
    try {
        const { homeworkId } = req.params;
        const { submissionText = "", attachment = "" } = req.body;

        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid homework ID",
            });
        }

        const student = await getStudentProfile(req);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found. This user is not linked to a Student record.",
                userId,
            });
        }

        const homework = await Homework.findById(homeworkId);

        if (!homework) {
            return res.status(404).json({
                success: false,
                message: "Homework not found",
            });
        }

        if (
            typeof submissionText !== "string" ||
            typeof attachment !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Submission text and attachment must be strings",
            });
        }

        if (!submissionText.trim() && !attachment.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide submission text or attachment",
            });
        }

        const existingSubmission = await HomeworkSubmission.findOne({
            homework: homeworkId,
            student: student._id,
        });

        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                message: "Homework already submitted",
            });
        }

        const isLate = new Date() > new Date(homework.dueDate);

        const submission = await HomeworkSubmission.create({
            homework: homeworkId,
            student: student._id,
            submissionText: submissionText.trim(),
            attachment: attachment.trim(),
            status: isLate ? "Late" : "Submitted",
        });

        return res.status(201).json({
            success: true,
            message: "Homework submitted successfully",
            submission,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Homework already submitted",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 2. GET MY SUBMISSIONS
const getMySubmissions = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const student = await getStudentProfile(req);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found",
                userId,
            });
        }

        const submissions = await HomeworkSubmission.find({
            student: student._id,
        })
            .populate("homework")
            .sort({ submittedAt: -1 });

        return res.status(200).json({
            success: true,
            count: submissions.length,
            submissions,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 3. GET ALL SUBMISSIONS FOR A HOMEWORK
const getHomeworkSubmissions = async (req, res) => {
    try {
        if (!isTeacherOrAdmin(req.user)) {
            return res.status(403).json({
                success: false,
                message: "Only teachers or admins can view all submissions",
            });
        }

        const { homeworkId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid homework ID",
            });
        }

        const homework = await Homework.findById(homeworkId);

        if (!homework) {
            return res.status(404).json({
                success: false,
                message: "Homework not found",
            });
        }

        const submissions = await HomeworkSubmission.find({
            homework: homeworkId,
        })
            .populate({
                path: "student",
                populate: {
                    path: "user",
                    select: "name email",
                },
            })
            .populate("reviewedBy", "name email")
            .sort({ submittedAt: -1 });

        return res.status(200).json({
            success: true,
            count: submissions.length,
            submissions,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 4. REVIEW SUBMISSION
const reviewSubmission = async (req, res) => {
    try {
        if (!isTeacherOrAdmin(req.user)) {
            return res.status(403).json({
                success: false,
                message: "Only teachers or admins can review submissions",
            });
        }

        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid submission ID",
            });
        }

        const { marksObtained, feedback = "" } = req.body;

        if (
            marksObtained === undefined ||
            marksObtained === null ||
            !Number.isFinite(Number(marksObtained)) ||
            Number(marksObtained) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid marks",
            });
        }

        const submission = await HomeworkSubmission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
            });
        }

        submission.marksObtained = Number(marksObtained);
        submission.feedback = feedback;
        submission.status = "Reviewed";
        submission.reviewedBy = userId;
        submission.reviewedAt = new Date();

        await submission.save();

        return res.status(200).json({
            success: true,
            message: "Homework reviewed successfully",
            submission,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 5. GET SINGLE SUBMISSION
const getSubmissionById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid submission ID",
            });
        }

        const submission = await HomeworkSubmission.findById(req.params.id)
            .populate("homework")
            .populate({
                path: "student",
                populate: {
                    path: "user",
                    select: "name email",
                },
            })
            .populate("reviewedBy", "name email");

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
            });
        }

        if (!isTeacherOrAdmin(req.user)) {
            const student = await getStudentProfile(req);

            if (
                !student ||
                !submission.student ||
                submission.student._id.toString() !== student._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to view this submission",
                });
            }
        }

        return res.status(200).json({
            success: true,
            submission,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    submitHomework,
    getMySubmissions,
    getHomeworkSubmissions,
    reviewSubmission,
    getSubmissionById,
};
