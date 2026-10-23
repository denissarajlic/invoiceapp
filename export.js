// Export the invoices the list shows to a CSV file for Excel or Google Sheets.
// Set up for Excel with Bosnian settings: ";" between columns, "1250,00" for
// amounts, and a marker at the start so č, ć, š, đ and ž come out right.

// 125000 cents → "1250,00": no thousands dots, so Excel reads it as a number.
function csvAmount(cents) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

// "2026-10-23" → "23.10.2026"
function csvDate(date) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

// Put a value in quotes when it contains ; or quotes or a new line.
// Text starting with = + - @ gets a ' in front, so Excel never treats it as a formula.
function csvCell(value) {
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return /[;"\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function invoicesToCsv(invoices) {
  const header = ["invoiceNo", "client", "date", "dueDate", "withoutVat", "vat", "total", "currency", "status"].map(t);
  const rows = invoices.map((saved) => {
    const { subtotal, vat, total } = totalsOf(saved.lines);
    return [
      saved.number,
      saved.client,
      csvDate(saved.date),
      csvDate(dueDateOf(saved)),
      csvAmount(subtotal),
      csvAmount(vat),
      csvAmount(total),
      saved.currency,
      t(saved.paid ? "paid" : "unpaid"),
    ];
  });
  // Windows line endings, which Excel likes best.
  return [header, ...rows].map((row) => row.map(csvCell).join(";")).join("\r\n");
}

function exportCsv() {
  const invoices = shownInvoices(loadInvoices().sort(byNumberNewestFirst));
  const name = `${t("fileName")}-${monthFilter === "all" ? t("fileNameAll") : monthFilter}.csv`;
  // "﻿" tells Excel the file is UTF-8, so Bosnian letters show correctly.
  const file = new Blob(["﻿" + invoicesToCsv(invoices)], { type: "text/csv;charset=utf-8" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
