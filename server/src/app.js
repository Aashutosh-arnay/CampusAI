const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");


const app = express();

app.use(cors());
app.use(express.json());


// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);

// Test API
app.get("/", (req, res) => {
    res.json({
        message: "CampusAI Backend Running 🚀"
    });
});


module.exports = app;