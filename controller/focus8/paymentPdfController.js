const { generateRuntimePdf } = require("../../services/focus8/focus8PaymentPdfService");
const { getPayments, getPaymentByDocNo } = require("../../services/focus8/focus8Service");
const numberToWords = require("../../utils/commanUtils/numberToWords");

const generatePdfController = async (req, res) => {
  try {
    const docNo = decodeURIComponent(req.params.docNo);
    const itemIndex = parseInt(req.params.itemIndex);

    if (!docNo) {
      return res.status(400).json({ message: "docNo is required" });
    }

    if (isNaN(itemIndex)) {
      return res.status(400).json({ message: "itemIndex must be a number" });
    }

    // 1️⃣ Get List API for formatted date, currency, status
    const listResponse = await getPayments();
    const rows = listResponse?.[0]?.ColumnData || [];

    const row = rows.find(r => String(r?.[2]).trim() === String(docNo).trim());

    if (!row) {
      return res.status(404).json({ message: "Payment not found in list" });
    }

    const headerId = row[0];
    const transactionDate = row[1];
    const transactionCurrency = row[4];
    const transactionStatus = row[19];

    // 2️⃣ Get Single Payment details
    const paymentDetails = await getPaymentByDocNo(docNo);

    if (!paymentDetails?.data?.[0]) {
      return res.status(404).json({ message: "Detailed payment data not found" });
    }

    const paymentData = paymentDetails.data[0];
    const header = paymentData.Header;
    const bodyItems = paymentData.Body || [];

    if (!bodyItems[itemIndex]) {
      return res.status(404).json({ message: "Invalid item index" });
    }

    const item = bodyItems[itemIndex];

    const amount = item.Amount || 0;
    const tds = item.TDS || 0;
    const netAmount = amount - tds;

    const payment = {
      headerId,
      date: transactionDate,
      voucherNumber: header.DocNo,

      payeeName: item.Account__Name || header.CashBankAC__Name || "",
      payeeAddress1: "",
      payeeAddress2: "",
      payeePin: "",
      payeeGstin: "",
      payeeBankName: item.VendorBank || "",
      payeeIfsc: item.VendorBankIFSC || "",

      payerName: header.CostCenter__Name || "",
      payerAddress1: header.Department__Name || "",
      payerAddress2: "",
      payerPin: "",

      currency: transactionCurrency,
      status: transactionStatus,

      amountInWords: numberToWords(netAmount),

      items: [
        {
          amount: amount.toFixed(2),
          tds: tds.toFixed(2),
          netAmount: netAmount.toFixed(2),
          reference: Array.isArray(item.Reference) && item.Reference[0]
            ? item.Reference[0].Reference
            : "-",
          remarks: item.sRemarks || "-"
        }
      ]
    };

    const pdfBuffer = await generateRuntimePdf(payment);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${docNo}_item_${itemIndex + 1}.pdf`,
      "Content-Length": pdfBuffer.length
    });

    return res.send(pdfBuffer);

  } catch (err) {
    console.error("PDF ERROR:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};

module.exports = { generatePdfController };