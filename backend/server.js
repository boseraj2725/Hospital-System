require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const billingRoutes = require("./routes/billingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const reportRoutes = require("./routes/reportRoutes");



const app = express();

// ==============================
// Create HTTP Server
// ==============================
const server = http.createServer(app);

// ==============================
// Socket.IO Setup
// ==============================
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});

// Make io available in controllers
app.set("io", io);

// ==============================
// Connect MongoDB
// ==============================
connectDB();

// ==============================
// Middlewares
// ==============================
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

// ==============================
// Socket Connection
// ==============================
io.on("connection", (socket) => {

    console.log("🟢 User Connected:", socket.id);

    socket.on("disconnect", () => {

        console.log("🔴 User Disconnected:", socket.id);

    });

});

// ==============================
// Home Route
// ==============================
app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "🏥 SmartCare AI Hospital Backend Running...",
    });

});

// ==============================
// Test Route
// ==============================
app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "API Working Successfully",
    });

});

// ==============================
// API Routes
// ==============================
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/billing", billingRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/patients", patientRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/users", userRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/invoice", invoiceRoutes);

app.use("/api/forgot-password", forgotPasswordRoutes);

app.use("/api/reports", reportRoutes);



// ==============================
// 404 Route
// ==============================
app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });

});

// ==============================
// Global Error Handler
// ==============================
app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });

});

// ==============================
// Start Server
// ==============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(`🚀 Server Running : http://localhost:${PORT}`);

});