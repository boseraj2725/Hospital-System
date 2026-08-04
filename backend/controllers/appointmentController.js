const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

// ===============================
// Create Appointment
// ===============================
const createAppointment = async (req, res) => {

    try {

        const {
            doctor,
            appointmentDate,
            appointmentTime,
            reason,
        } = req.body;

        const appointment = new Appointment({

            patient: req.user.id,

            doctor,

            appointmentDate,

            appointmentTime,

            reason,

        });

        await appointment.save();

        // Create Notification
        const notification = await Notification.create({

            title: "New Appointment",

            message: "A new appointment has been booked.",

            role: "Admin",

        });

        // Live Notification
        const io = req.app.get("io");

        if (io) {

            io.emit("newNotification", notification);

        }

        res.status(201).json({

            success: true,

            message: "Appointment Booked Successfully",

            appointment,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// ===============================
// Get All Appointments
// ===============================
const getAppointments = async (req, res) => {

    try {

        const appointments = await Appointment.find()
            .populate("patient", "name phone")
            .populate("doctor", "name specialization")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            appointments,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ===============================
// Get Appointment By ID
// ===============================
const getAppointmentById = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id)
            .populate("patient")
            .populate("doctor");

        if (!appointment) {

            return res.status(404).json({
                success: false,
                message: "Appointment Not Found",
            });

        }

        res.status(200).json({
            success: true,
            appointment,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ===============================
// Update Appointment
// ===============================
const updateAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!appointment) {

            return res.status(404).json({
                success: false,
                message: "Appointment Not Found",
            });

        }

        res.status(200).json({
            success: true,
            message: "Appointment Updated Successfully",
            appointment,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ===============================
// Delete Appointment
// ===============================
const deleteAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {

            return res.status(404).json({
                success: false,
                message: "Appointment Not Found",
            });

        }

        // Create Notification
        const notification = await Notification.create({

            title: "Appointment Deleted",

            message: "An appointment has been deleted.",

            role: "Admin",

        });

        // Live Notification
        const io = req.app.get("io");

        if (io) {

            io.emit("newNotification", notification);

        }

        res.status(200).json({
            success: true,
            message: "Appointment Deleted Successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ===============================
// Export
// ===============================
module.exports = {

    createAppointment,

    getAppointments,

    getAppointmentById,

    updateAppointment,

    deleteAppointment,

};