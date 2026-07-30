const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const facultyAssignmentRoutes = require("./routes/facultyAssignmentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const marksRoutes = require("./routes/marksRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");


const app = express();

app.use(cors());
app.use(express.json());


// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/faculty-assignments", facultyAssignmentRoutes);
app.use("/api/enrollments",enrollmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/timetable", timetableRoutes);
// Test API
app.get("/", (req, res) => {
    res.json({
        message: "CampusAI Backend Running 🚀"
    });
});
app.use(errorMiddleware);

module.exports = app;