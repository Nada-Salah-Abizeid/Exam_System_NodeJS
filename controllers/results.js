const resultModel = require("../models/results");
const AppError = require("../utils/AppError");
const { CatchAsync } = require("../utils/CatchAsync");

const getAllResults = CatchAsync(async (req, res, next) => {
  let results = await resultModel
    .find()
    .populate("examId", "title questions passingScore")
    .populate("studentId", "username email")
    .sort({ createdAt: -1 });

  // Transform the results to include calculated fields
  const transformedResults = results.map((result) => {
    const exam = result.examId;
    const student = result.studentId;
    const totalQuestions = exam?.questions?.length || 0;
    const correctAnswers = result.score || 0;
    const percentage = parseFloat(result.percentage) || 0;
    const passingScore = parseFloat(exam?.passingScore) || 70;
    const passed = percentage >= passingScore;

    console.log(
      `Student: ${student?.username}, Percentage: ${percentage}, Passing Score: ${passingScore}, Passed: ${passed}`
    );

    return {
      _id: result._id,
      examId: exam?._id,
      examTitle: exam?.title || "Untitled Exam",
      studentId: student?._id,
      studentName: student?.username || "Unknown Student",
      studentEmail: student?.email || "",
      score: correctAnswers,
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      percentage: percentage,
      passed: passed,
      completedAt: result.createdAt,
      createdAt: result.createdAt,
    };
  });

  res.status(200).json({
    status: "Success",
    data: transformedResults,
  });
});

const getStudentResults = CatchAsync(async (req, res, next) => {
  const studentId = req.id;
  let results = await resultModel
    .find({ studentId })
    .populate("examId", "title questions passingScore")
    .populate("studentId", "username email")
    .sort({ createdAt: -1 });

  if (results) {
    // Transform the results to include calculated fields
    const transformedResults = results.map((result) => {
      const exam = result.examId;
      const student = result.studentId;
      const totalQuestions = exam?.questions?.length || 0;
      const correctAnswers = result.score || 0;
      const percentage = parseFloat(result.percentage) || 0;
      const passingScore = parseFloat(exam?.passingScore) || 70;
      const passed = percentage >= passingScore;

      return {
        _id: result._id,
        examId: exam?._id,
        examTitle: exam?.title || "Untitled Exam",
        studentId: student?._id,
        studentName: student?.username || "Unknown Student",
        studentEmail: student?.email || "",
        score: correctAnswers,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
        percentage: percentage,
        passed: passed,
        completedAt: result.createdAt,
        createdAt: result.createdAt,
        timeTaken: result.timeTaken || 0,
      };
    });

    res.status(200).json({
      status: "success",
      data: transformedResults,
    });
  } else {
    next(new AppError(400, "Result not found"));
  }
});

module.exports = { getAllResults, getStudentResults };
