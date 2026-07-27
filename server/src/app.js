const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");


const app = express();

app.use(cors());
app.use(express.json());


// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);


// Test API
app.get("/", (req, res) => {
    res.json({
        message: "CampusAI Backend Running 🚀"
    });
});


module.exports = app;