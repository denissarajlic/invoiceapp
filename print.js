// Printing an invoice, or saving it as a PDF from the print window.
// The invoice is drawn into #print-area, which is hidden on screen and is
// the only thing shown on paper.

// Make an element with some text, e.g. el("p", "note", "Thank you").
function el(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

// 1.5 → "1,5", 1250 → "1.250". Used for quantities.
function formatQuantity(quantity) {
  return quantity.toLocaleString("de-DE", { maximumFractionDigits: 3 });
}

// Your business details from Settings, top left. Empty fields are left out.
function printSeller() {
  const seller = el("div", "print-seller");
  const business = loadBusiness();
  if (business.name) seller.append(el("div", "print-seller-name", business.name));
  if (business.address) seller.append(el("div", "", business.address));
  if (business.jib) seller.append(el("div", "", `JIB ${business.jib}`));
  if (business.bank) seller.append(el("div", "", `${t("bankAccount")}: ${business.bank}`));
  return seller;
}

// Number, date and due date, top right.
function printHeading(saved) {
  const heading = el("div", "print-heading");
  heading.append(el("h1", "", t("invoice")));
  const facts = el("dl", "print-facts");
  const rows = [
    [t("invoiceNo"), saved.number],
    [t("date"), formatDate(saved.date)],
    [t("dueDate"), formatDate(dueDateOf(saved))],
  ];
  for (const [label, value] of rows) {
    const row = el("div");
    row.append(el("dt", "", label), el("dd", "", value));
    facts.append(row);
  }
  heading.append(facts);
  return heading;
}

// Who the invoice is for, with the details saved on the invoice itself.
function printClient(saved) {
  const client = el("div", "print-client");
  client.append(el("div", "print-label", t("billTo")));
  client.append(el("div", "print-client-name", saved.client || t("noClient")));
  if (saved.clientAddress) client.append(el("div", "", saved.clientAddress));
  if (saved.clientJib) client.append(el("div", "", `JIB ${saved.clientJib}`));
  return client;
}

function printLines(saved) {
  const table = el("table", "print-lines");
  const head = el("tr");
  for (const [key, className] of [["lineNo", "num"], ["description", ""], ["quantity", "num"], ["price", "num"], ["amount", "num"]]) {
    head.append(el("th", className, t(key)));
  }
  table.append(el("thead"));
  table.tHead.append(head);

  const body = el("tbody");
  saved.lines.forEach((line, index) => {
    const row = el("tr");
    row.append(
      el("td", "num", `${index + 1}.`),
      el("td", "", line.description),
      el("td", "num", formatQuantity(line.quantity)),
      el("td", "num", formatMoney(toCents(line.price), saved.currency)),
      el("td", "num", formatMoney(lineCents(line), saved.currency)),
    );
    body.append(row);
  });
  table.append(body);
  return table;
}

function printTotals(saved) {
  const { subtotal, vat, total } = totalsOf(saved.lines);
  const totals = el("dl", "print-totals");
  for (const [key, cents, className] of [["withoutVat", subtotal, ""], ["vat", vat, ""], ["total", total, "print-grand-total"]]) {
    const row = el("div", className);
    row.append(el("dt", "", t(key)), el("dd", "", formatMoney(cents, saved.currency)));
    totals.append(row);
  }
  return totals;
}

function printInvoice(saved) {
  const area = document.getElementById("print-area");
  const top = el("header", "print-top");
  top.append(printSeller(), printHeading(saved));
  area.replaceChildren(top, printClient(saved), printLines(saved), printTotals(saved));
  if (saved.note) {
    area.append(el("p", "print-note", saved.note));
  }
  window.print();
}
