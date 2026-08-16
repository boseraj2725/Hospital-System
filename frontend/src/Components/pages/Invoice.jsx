import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../../services/api";
import "../styles/Invoice.css";

function Invoice() {

    const { id } = useParams();

    const invoiceRef = useRef(null);

    const [bill, setBill] = useState(null);

    useEffect(() => {
        fetchBill();
    }, [id]);

    const fetchBill = async () => {

        try {

            const res = await api.get(`/billing/${id}`);

            setBill(res.data.bill);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to Load Invoice"
            );

        }

    };

    const downloadPDF = async () => {

        try {

            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2,
            });

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();

            const pdfHeight =
                (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                pdfWidth,
                pdfHeight
            );

            pdf.save("Hospital-Invoice.pdf");

        } catch (error) {

            toast.error("PDF Download Failed");

        }

    };

    const sendInvoiceEmail = async () => {

        const email = prompt("Enter Patient Email");

        if (!email) return;

        try {

            const res = await api.post(
                `/billing/send-email/${id}`,
                { email }
            );

            toast.success(res.data.message);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Email Sending Failed"
            );

        }

    };

    if (!bill) {

        return (
            <h2 style={{ textAlign: "center" }}>
                Loading...
            </h2>
        );

    }

    return (

        <div className="invoice">

            <div
                className="invoice-card"
                ref={invoiceRef}
            >

                <h1>🏥 Medlora Hospital</h1>

                <h2>Invoice</h2>

                <hr />

                <p><strong>Patient :</strong> {bill.patientName}</p>

                <p><strong>Doctor :</strong> {bill.doctorName}</p>

                <p><strong>Consultation Fee :</strong> ₹ {bill.consultationFee}</p>

                <p><strong>Medicine Fee :</strong> ₹ {bill.medicineFee}</p>

                <p><strong>Lab Fee :</strong> ₹ {bill.labFee}</p>

                <p><strong>Other Charges :</strong> ₹ {bill.otherFee}</p>

                <hr />

                <h2>Total Amount : ₹ {bill.totalAmount}</h2>

                <p>
                    <strong>Payment Status :</strong>{" "}
                    {bill.paymentStatus}
                </p>

                <div className="button-group">

                    <button
                        className="print-btn"
                        onClick={() => window.print()}
                    >
                        🖨 Print Invoice
                    </button>

                    <button
                        className="pdf-btn"
                        onClick={downloadPDF}
                    >
                        📄 Download PDF
                    </button>

                    <button
                        className="email-btn"
                        onClick={sendInvoiceEmail}
                    >
                        📧 Send Email
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Invoice;