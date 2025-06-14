const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/exams");
const { submitExam } = require("../controllers/examResult");
const { auth, restrictTo } = require("../middlewares/auth");

router.post("/", auth, restrictTo("admin"), createExam);
router.patch("/:id", auth, restrictTo("admin"), updateExam);
router.delete("/:id", auth, restrictTo("admin"), deleteExam);

router.post("/:id/question", auth, restrictTo("admin"), addQuestion);
router.patch("/:examId/:questionId", auth, restrictTo("admin"), updateQuestion);
router.delete(
  "/:examId/:questionId",
  auth,
  restrictTo("admin"),
  deleteQuestion
);

router.post("/:id/submit", auth, restrictTo("student"), submitExam);

router.get("/", auth, restrictTo("admin", "student"), getExams);
router.get("/teacher", auth, restrictTo("admin"), getExamsByTeacher);
router.get("/:id", auth, restrictTo("admin", "student"), getExam);
router.get("/:id/take", auth, restrictTo("student"), takeExam);

module.exports = router;
