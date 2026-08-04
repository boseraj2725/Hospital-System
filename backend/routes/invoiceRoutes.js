// const express = require("express");

// const router = express.Router();

// const protect = require("../middleware/authMiddleware");

// const {
//     generateInvoice,
// } = require("../controllers/invoiceController");

// // ==========================
// // Test Route (Keep this FIRST)
// // ==========================
// router.get("/test", (req, res) => {

//     res.json({
//         success: true,
//         message: "Invoice Route Working",
//     });

// });

// // ==========================
// // Generate Invoice PDF
// // ==========================
// router.get(
//     "/:id",
//     protect,
//     generateInvoice
// );

// module.exports = router;

const express = require("express");

const router = express.Router();

const {
    generateInvoice,
} = require("../controllers/invoiceController");

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Invoice Route Working",
    });
});

router.get("/:id", generateInvoice);

module.exports = router;