// Export the invoices the list shows to a CSV file for Excel or Google Sheets.
// Excel reads CSV files differently depending on its language settings, so
// Settings lets you pick which kind of Excel the file is for:
//   "eu": Bosnian / European Excel: ";" between columns, "1250,00", "23.10.2026"
//   "en": English Excel:            "," between columns, "1250.00", "2026-10-23"
// A marker at the start makes č, ć, š, đ and ž come out right in both.
const CSV_STYLE_KEY = "csvStyle";

// Set when you pick in Settings, so it works even if the browser won't store it.
let csvStyleChoice = null;

// First time: guess from the browser's number format. "1,5" means European.
function csvStyle() {
  if (csvStyleChoice) return csvStyleChoice;
  try {
    const saved = localStorage.getItem(CSV_STYLE_KEY);
    if (saved === "eu" || saved === "en") return saved;
  } catch {
    // Fall back to the guess.
  }
  return (1.5).toLocaleString().includes(",") ? "eu" : "en";
}

function csvSeparator() {
  return csvStyle() === "eu" ? ";" : ",";
}

// 125000 cents → "1250,00" or "1250.00": no thousands separator,
// so Excel reads it as a number it can add up.
function csvAmount(cents) {
  const amount = (cents / 100).toFixed(2);
  return csvStyle() === "eu" ? amount.replace(".", ",") : amount;
}

// "2026-10-23" → "23.10.2026" for European Excel. English Excel gets
// "2026-10-23", which it reads as a real date.
function csvDate(date) {
  if (!date) return "";
  if (csvStyle() === "en") return date;
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

// Put a value in quotes when it contains the separator, quotes or a new line.
// Text starting with = + - @ gets a ' in front, so Excel never treats it as a formula.
function csvCell(value) {
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  const needsQuotes = text.includes(csvSeparator()) || /["\n\r]/.test(text);
  return needsQuotes ? `"${text.replace(/"/g, '""')}"` : text;
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
      t(statusOf(saved)),
    ];
  });
  // Windows line endings, which Excel likes best.
  return [header, ...rows].map((row) => row.map(csvCell).join(csvSeparator())).join("\r\n");
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
