const puppeteer = require("puppeteer");

const generateRuntimePdf = async (payments) => {

  const paymentList = Array.isArray(payments) ? payments : [payments];

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>

@page {
  size: A4;
  margin: 10mm;
}

body {
  font-family: Arial, sans-serif;
  font-size: 11px;
}

.page-container {
  page-break-after: always;
  padding: 10px;
  min-height: 95vh;
  position: relative;
}

.page-container:last-child {
  page-break-after: avoid;
}

.title {
  text-align: center;
  font-size: 14px;
  margin-bottom: 15px;
}

.top-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.block {
  width: 48%;
  font-size: 10px;
}

.block p {
  margin: 2px 0;
}

/* ================= TABLE STYLING ================= */

.grid-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  border: 1px solid #000;
}

.grid-table th,
.grid-table td {
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  border-top: none;
  border-bottom: none;
  padding: 4px;
  font-size: 10px;
}

.grid-table th {
  border-bottom: 1px solid #000;
  background: #f2f2f2;
  text-align: center;
}

.amount-right {
  text-align: right;
}

/* Footer Section */
.footer {
  margin-top: 15px;
  font-size: 11px;
}

.notes {
  margin-top: 20px;
  font-size: 10px;
}

</style>
</head>
<body>

${paymentList.map((payment) => `
<div class="page-container">

    <div class="title">BANK PAYMENT ADVICE</div>

    <div class="top-section">

      <div class="block">
        <p>${payment.payeeName}</p>
        ${payment.payeeAddress1 ? `<p>${payment.payeeAddress1}</p>` : ''}
        ${payment.payeeAddress2 ? `<p>${payment.payeeAddress2}</p>` : ''}
        ${payment.payeePin ? `<p>PIN: ${payment.payeePin}</p>` : ''}
        ${payment.payeeGstin ? `<p>GSTIN: ${payment.payeeGstin}</p>` : ''}
        <br/>
        <p>Bank Name: ${payment.payeeBankName || "-"}</p>
        <p>IFSC Code: ${payment.payeeIfsc || "-"}</p>
        <p>Voucher No: ${payment.voucherNumber}</p>
        <p>Date: ${payment.date}</p>
      </div>

      <div class="block">
        <p>${payment.payerName}</p>
        ${payment.payerAddress1 ? `<p>${payment.payerAddress1}</p>` : ''}
        ${payment.payerAddress2 ? `<p>${payment.payerAddress2}</p>` : ''}
        ${payment.payerPin ? `<p>PIN: ${payment.payerPin}</p>` : ''}
        <br/>
        <p>Status: ${payment.status}</p>
        <p>Header ID: ${payment.headerId}</p>
        <p>Currency: ${payment.currency}</p>
        <br/>
         <p>Bank Name: ICICI Bank</p>
         <p>IFSC Code: - </p>
         <p>A/C No: - </p>
      </div>

    </div>

    <table class="grid-table">
      <thead>
        <tr>
          <th style="width:5%">Sr No</th>
          <th style="width:20%">Doc Number</th>
          <th style="width:25%">Reference</th>
          <th style="width:12%">Amount</th>
          <th style="width:12%">TDS</th>
          <th style="width:12%">Net Amount</th>
          <th style="width:14%">Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${payment.items.map((item, index) => `
        <tr>
          <td style="text-align:center">${index + 1}</td>
          <td>${payment.voucherNumber}</td>
          <td>${item.reference || "-"}</td>
          <td class="amount-right">${item.amount}</td>
          <td class="amount-right">${item.tds || "0.00"}</td>
          <td class="amount-right">${item.netAmount}</td>
          <td>${item.remarks || "-"}</td>
        </tr>
        `).join("")}

        <!-- Fill empty rows to maintain height, ensuring it covers the full A4 page -->
        ${Array(Math.max(0, 34 - payment.items.length)).fill(`
          <tr style="height: 20px;">
            <td>&nbsp;</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `).join("")}

      </tbody>
    </table>

    <div class="footer">
      <p>Net Amount in Words: ${payment.amountInWords}</p>
    </div>

    <div class="notes">
      <p>Note:</p>
      <p>1. This payment advice indicates payment process at our end & amount will get credited to your account within 3-4 working days.</p>
      <p>2. If any discrepancy in payment please revert us at accounts@venusohs.com in 30 working days.</p>
    </div>

</div>
`).join("")}

</body>
</html>
`;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return pdfBuffer;
};

module.exports = { generateRuntimePdf };
