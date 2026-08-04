const PDFDocument = require("pdfkit");
const Billing = require("../models/Billing");

const generateInvoice = async (req, res) => {

    try {

        const bill = await Billing.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Bill Not Found",
            });
        }

        const doc = new PDFDocument();

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `inline; filename=Invoice-${bill._id}.pdf`
        );

        doc.pipe(res);

        doc.fontSize(22).text("SmartCare AI Hospital", {
            align: "center",
        });

        doc.moveDown();

        doc.fontSize(18).text("Invoice");

        doc.moveDown();

        doc.fontSize(14).text(`Patient : ${bill.patientName}`);
        doc.text(`Doctor : ${bill.doctorName}`);
        doc.text(`Consultation Fee : ₹${bill.consultationFee}`);
        doc.text(`Medicine Fee : ₹${bill.medicineFee}`);
        doc.text(`Lab Fee : ₹${bill.labFee}`);
        doc.text(`Other Fee : ₹${bill.otherFee}`);

        doc.moveDown();

        doc.fontSize(16).text(
            `Total Amount : ₹${bill.totalAmount}`
        );

        doc.text(
            `Payment Status : ${bill.paymentStatus}`
        );

        doc.end();

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    generateInvoice,
};