const Billing = require("../models/Billing");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

// ===============================
// Add Bill
// ===============================
const addBill = async (req, res) => {

    try {

        const {
            patientName,
            doctorName,
            consultationFee,
            medicineFee,
            labFee,
            otherFee,
            paymentStatus,
        } = req.body;

        const totalAmount =
            Number(consultationFee) +
            Number(medicineFee) +
            Number(labFee) +
            Number(otherFee);

        const bill = new Billing({

            patientName,

            doctorName,

            consultationFee,

            medicineFee,

            labFee,

            otherFee,

            totalAmount,

            paymentStatus,

        });

        await bill.save();

        // Create Notification
        const notification = await Notification.create({

            title: "New Bill Created",

            message: `Bill created for ${bill.patientName}.`,

            role: "Admin",

        });

        // Live Notification
        const io = req.app.get("io");

        if (io) {

            io.emit("newNotification", notification);

        }

        res.status(201).json({

            success: true,

            message: "Bill Created Successfully",

            bill,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ===============================
// Get All Bills
// ===============================
const getBills = async (req, res) => {

    try {

        const bills = await Billing.find().sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            bills,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ===============================
// Get Single Bill
// ===============================
const getBillById = async (req, res) => {

    try {

        const bill = await Billing.findById(req.params.id);

        if (!bill) {

            return res.status(404).json({
                success: false,
                message: "Bill Not Found",
            });

        }

        res.status(200).json({
            success: true,
            bill,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ===============================
// Update Bill
// ===============================
const updateBill = async (req, res) => {

    try {

        const {
            consultationFee,
            medicineFee,
            labFee,
            otherFee,
        } = req.body;

        req.body.totalAmount =
            Number(consultationFee) +
            Number(medicineFee) +
            Number(labFee) +
            Number(otherFee);

        const bill = await Billing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!bill) {

            return res.status(404).json({
                success: false,
                message: "Bill Not Found",
            });

        }

        res.status(200).json({
            success: true,
            message: "Bill Updated Successfully",
            bill,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ===============================
// Delete Bill
// ===============================
const deleteBill = async (req, res) => {

    try {

        const bill = await Billing.findByIdAndDelete(req.params.id);

        if (!bill) {

            return res.status(404).json({
                success: false,
                message: "Bill Not Found",
            });

        }

        // Create Notification
        const notification = await Notification.create({

            title: "Bill Deleted",

            message: `Bill for ${bill.patientName} has been deleted.`,

            role: "Admin",

        });

        // Live Notification
        const io = req.app.get("io");

        if (io) {

            io.emit("newNotification", notification);

        }

        res.status(200).json({

            success: true,

            message: "Bill Deleted Successfully",

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ===============================
// Send Invoice Email
// ===============================
const sendInvoiceEmail = async (req, res) => {

    try {

        const bill = await Billing.findById(req.params.id);

        if (!bill) {

            return res.status(404).json({
                success: false,
                message: "Bill Not Found",
            });

        }

        const message = `
🏥 SmartCare AI Hospital

Invoice Details

Patient Name : ${bill.patientName}
Doctor Name : ${bill.doctorName}

Consultation Fee : ₹${bill.consultationFee}
Medicine Fee : ₹${bill.medicineFee}
Lab Fee : ₹${bill.labFee}
Other Fee : ₹${bill.otherFee}

Total Amount : ₹${bill.totalAmount}

Payment Status : ${bill.paymentStatus}

Thank you for choosing SmartCare AI Hospital.
`;

        await sendEmail(
            req.body.email,
            "Hospital Invoice",
            message
        );

        res.status(200).json({

            success: true,

            message: "Invoice Sent Successfully",

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

    addBill,

    getBills,

    getBillById,

    updateBill,

    deleteBill,

    sendInvoiceEmail,

};