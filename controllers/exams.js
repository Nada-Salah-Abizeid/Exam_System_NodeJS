const examModel = require("../models/exams");
const AppError = require("../utils/AppError");
const { CatchAsync } = require("../utils/CatchAsync");

const createExam = CatchAsync(async (req, res, next) => {
  let examData = req.body;
  examData.createdBy = req.id;
  try {
    let exam = await examModel.create(examData);
    res.status(200).json({
      status: "Success",
      data: exam,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const getExams = CatchAsync(async (req, res, next) => {
  try {
    let exams = await examModel.find().select("-questions");

    res.status(200).json({
      status: "Success",
      data: exams,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const getExam = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    let exam = await examModel.findById(id);
    res.status(200).json({
      status: "Success",
      data: exam,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const updateExam = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  try {
    let exam = await examModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (exam) {
      res.status(200).json({
        status: "success",
        data: exam,
      });
    } else {
      next(new AppError(400, "Exam not found"));
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const deleteExam = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    let exam = await examModel.findByIdAndDelete(id);
    if (exam) {
      res.status(200).json({
        status: "success",
      });
    } else {
      next(new AppError(400, "Exam not found"));
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const takeExam = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    let exam = await examModel
      .findById(id)
      .select("-questions.options.isCorrect");
    if (exam) {
      res.status(200).json({
        status: "success",
        data: exam,
      });
    } else {
      next(new AppError(400, "Exam not found"));
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const addQuestion = CatchAsync(async (req, res, next) => {
  const { question, options } = req.body;
  const { id } = req.params;
  try {
    let exam = await examModel.findById(id);
    if (exam) {
      const newQuestion = { question, options };
      exam.questions.push(newQuestion);
      await exam.save();

      // Return the newly added question
      const addedQuestion = exam.questions[exam.questions.length - 1];
      res.status(200).json({
        status: "Success",
        data: addedQuestion,
      });
    } else {
      next(new AppError(400, "Exam not found"));
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const updateQuestion = CatchAsync(async (req, res, next) => {
  const { examId, questionId } = req.params;
  try {
    let exam = await examModel.findById(examId);
    if (exam) {
      const question = exam.questions.id(questionId);
      if (question) {
        question.set(req.body);
        await exam.save();
        res.status(200).json({
          status: "Success",
          data: exam,
        });
      } else {
        next(new AppError(400, "Question not found"));
      }
    } else {
      next(new AppError(400, "Exam not found"));
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const deleteQuestion = CatchAsync(async (req, res, next) => {
  const { examId, questionId } = req.params;
  try {
    let exam = await examModel.findById(examId);
    if (exam) {
      let question = await examModel.findByIdAndUpdate(
        examId,
        { $pull: { questions: { _id: questionId } } },
        { new: true }
      );
      if (question) {
        res.status(200).json({
          status: "success",
        });
      } else {
        next(new AppError(400, "Question not found"));
      }
    } else {
      next(new AppError(400, "Exam not found"));
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const getExamsByTeacher = async (req, res, next) => {
  try {
    const teacherId = req.id;

    const exams = await examModel.find({ createdBy: teacherId });
    if (exams) {
      res.status(200).json({
        status: "success",
        data: exams,
      });
    } else {
      next(new AppError(400, "Teacher ID not found"));
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
  takeExam,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getExamsByTeacher,
};
