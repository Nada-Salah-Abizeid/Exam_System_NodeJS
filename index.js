require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const usersRoutes = require("./routes/users");
const examsRoutes = require("./routes/exams");
const resultRoutes = require("./routes/results");
const mongoose = require("mongoose");
const AppError = require("./utils/AppError");

mongoose
  .connect("mongodb://localhost:27017/examSystem")
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });

const app = express();
app.use(express.json());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views")); // more robust

app.use(
  cors({
    origin: "*",
  })
);

app.use("/users", usersRoutes);
app.use("/exams", examsRoutes);
app.use("/results", resultRoutes);

app.get("/", (req, res) => {
  res.send(" API is working!");
});

app.use((req, res, next) => {
  next(new AppError(404, `Can not find ${req.originalUrl} on this server`));
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Something went wrong",
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`server started successfully on port ${port}`);
});
