require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// ==============================
// Routes
// ==============================
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

// ==============================
// App
// ==============================
const app = express();

// ==============================
// HTTP Server
// ==============================
const server = http.createServer(app);

// ==============================
// Allowed Frontend Origins
// ==============================
const allowedOrigins = [
    "http://localhost:5173",
    "https://hospital-system-front.onrender.com",
];

// ==============================
// CORS
// ==============================
app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests without Origin
            // Example: Postman
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log("❌ CORS Blocked:", origin);

            return callback(
                new Error("Not allowed by CORS")
            );
        },

        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH",
            "OPTIONS",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],

        credentials: true,
    })
);

// ==============================
// Body Parser
// ==============================
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// ==============================
// Static Uploads
// ==============================
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// ==============================
// Socket.IO
// ==============================
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,

        methods: [
            "GET",
            "POST",
        ],

        credentials: true,
    },

    transports: [
        "polling",
        "websocket",
    ],
});

// Make Socket.IO available
// inside controllers
app.set("io", io);

// ==============================
// Socket Connection
// ==============================
io.on("connection", (socket) => {

    console.log(
        "🟢 Socket Connected:",
        socket.id
    );

    socket.on("disconnect", (reason) => {

        console.log(
            "🔴 Socket Disconnected:",
            socket.id,
            reason
        );

    });
});

// ==============================
// MongoDB
// ==============================
connectDB();

// ==============================
// Home Route
// ==============================
app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message:
            "🏥 SmartCare AI Hospital Backend Running...",
    });

});

// ==============================
// API Test
// ==============================
app.get("/api/test", (req, res) => {

    res.status(200).json({
        success: true,
        message:
            "API Working Successfully",
    });

});

// ==============================
// API Routes
// ==============================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/appointments",
    appointmentRoutes
);

app.use(
    "/api/doctors",
    doctorRoutes
);

app.use(
    "/api/patients",
    patientRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/billing",
    billingRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/analytics",
    analyticsRoutes
);

app.use(
    "/api/invoice",
    invoiceRoutes
);

app.use(
    "/api/forgot-password",
    forgotPasswordRoutes
);

app.use(
    "/api/reports",
    reportRoutes
);

// ==============================
// 404 Handler
// ==============================
app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route Not Found",
        path: req.originalUrl,
    });

});

// ==============================
// Global Error Handler
// ==============================
app.use(
    (err, req, res, next) => {

        console.error(
            "❌ Server Error:",
            err.message
        );

        res.status(500).json({
            success: false,
            message:
                err.message ||
                "Internal Server Error",
        });

    }
);

// ==============================
// Start Server
// ==============================
const PORT =
    process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(
        `🚀 Server Running on port ${PORT}`
    );

    console.log(
        `🌐 Local: http://localhost:${PORT}`
    );

});