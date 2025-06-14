const examModel = require("../models/exams");
const resultModel = require("../models/results");
const AppError = require("../utils/AppError");
const { CatchAsync } = require("../utils/CatchAsync");

const submitExam = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(req.id);
  const studentId = req.id;
  
  const {  answers } = req.body;
  try {
    let exam = await examModel.findById(id);
    console.log(exam);
    
    if (exam) {
      let score = 0;
      const total = exam.questions.length;

      exam.questions.forEach((q) => {
        const studentAnswerId = answers[q._id.toString()];
        const correct = q.options.find((opt) => opt.isCorrect); 
        console.log(correct);
        
        if (correct && correct._id && correct._id.toString() === studentAnswerId) {
          score++;
        }
      });

      let percentage= ((score / total) * 100).toFixed(2)
      
      await resultModel.create({
        studentId:studentId,
        examId: id,
        score,
        percentage
      });

      res.json({
        success: true,
        score,
        total,
        percentage
      });
    } else {
      next(new AppError(400, "Exam not found"));
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = { submitExam };
