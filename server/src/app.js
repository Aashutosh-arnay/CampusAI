const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("@exortek/express-mongo-sanitize");
const xssMiddleware = require("./middleware/xssMiddleware");
const morgan = require("morgan");
const logger = require("./utils/logger");
const { config } = require("./config/env");


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
const departmentRoutes = require("./routes/departmentRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");


const app = express();
app.disable("x-powered-by");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});
app.use(helmet());
app.use(limiter);
app.use(
    cors({
       origin: config.clientUrl
    })
);
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(xssMiddleware);
app.use(

    morgan("dev", {

        stream: {

            write: (message) => {

                logger.info(message.trim());

            }

        }

    })

);

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
app.use("/api/departments", departmentRoutes);
// Test API
app.get("/", (req, res) => {
    res.json({
        message: "CampusAI Backend Running 🚀"
    });
});
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(errorMiddleware);

module.exports = app;