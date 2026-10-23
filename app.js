// Saved invoices live in the browser under this name.
const INVOICES_KEY = "invoices";
const LAST_NUMBERS_KEY = "lastInvoiceNumbers";

// The invoice being filled in.
// Prices are typed without VAT; the app adds 17% on top.
let invoice = blankInvoice();

const linesBox = document.getElementById("lines");
const lineTemplate = document.getElementById("line-template");

function blankInvoice() {
  return {
    client: "",
    date: todayText(),
    currency: "KM",
    lines: [newLine()],
  };
}

function newLine() {
  return { description: "", quantity: "1", price: "" };
}

// Today's date as "2026-10-23", the format a date field uses.
function todayText() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

const VAT_RATE = 0.17;

// Money is counted in whole cents (feninga), so 0.1 + 0.2 is exactly 0.30.
function toCents(amount) {
  return Math.round(Number((amount * 100).toFixed(6)));
}

// An empty or unreadable field counts as 0.
function numberFrom(text) {
  const number = parseFloat(text);
  return Number.isFinite(number) ? number : 0;
}

function lineCents(line) {
  return toCents(numberFrom(line.quantity) * numberFrom(line.price));
}

// Amount without VAT, VAT and total of any invoice, in cents.
function totalsOf(lines) {
  const subtotal = lines.reduce((sum, line) => sum + lineCents(line), 0);
  const vat = Math.round(subtotal * VAT_RATE);
  return { subtotal, vat, total: subtotal + vat };
}

// "292.50 KM". The Bosnian style (292,50 KM) comes in Feature 8.
function formatMoney(cents, currency = invoice.currency) {
  return `${(cents / 100).toFixed(2)} ${currency}`;
}

// "2026-10-23" → "23.10.2026."
function formatDate(date) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}.`;
}

// Work out every line amount and the three totals, and show them.
function updateTotals() {
  const amounts = linesBox.querySelectorAll(".amount");
  invoice.lines.forEach((line, index) => {
    amounts[index].textContent = formatMoney(lineCents(line));
  });

  const { subtotal, vat, total } = totalsOf(invoice.lines);
  document.getElementById("subtotal").textContent = formatMoney(subtotal);
  document.getElementById("vat").textContent = formatMoney(vat);
  document.getElementById("total").textContent = formatMoney(total);
}

// What's wrong with a line, as a list of text keys. Empty list = the line is OK.
// 0 and decimals are allowed; only negative numbers are refused.
function lineProblems(line) {
  const problems = [];
  if (line.description.trim() === "") problems.push("missingDescription");
  if (numberFrom(line.quantity) < 0) problems.push("negativeQuantity");
  if (numberFrom(line.price) < 0) problems.push("negativePrice");
  return problems;
}

// Lines you have already left at least once. A brand-new line doesn't
// complain about its empty description until you move away from it.
const visitedLines = new WeakSet();

// Show each line's problems under it in red, and mark the wrong fields.
function showProblems() {
  invoice.lines.forEach((line, index) => {
    const row = linesBox.children[index];
    let problems = lineProblems(line);
    if (!visitedLines.has(line)) {
      problems = problems.filter((problem) => problem !== "missingDescription");
    }
    row.querySelector(".description").classList.toggle("invalid", problems.includes("missingDescription"));
    row.querySelector(".quantity").classList.toggle("invalid", problems.includes("negativeQuantity"));
    row.querySelector(".price").classList.toggle("invalid", problems.includes("negativePrice"));

    const message = row.querySelector(".line-error");
    message.textContent = problems.map(t).join(" ");
    message.hidden = problems.length === 0;
  });

  // Once every line is fixed, the "Not saved" message is no longer true.
  const saveMessage = document.getElementById("save-message");
  if (saveMessage.className === "error" && invoice.lines.every((line) => lineProblems(line).length === 0)) {
    saveMessage.hidden = true;
  }
}

// Draw all lines again. Only called when a line is added or removed,
// so typing in a field never loses its place.
function renderLines() {
  linesBox.replaceChildren();
  invoice.lines.forEach((line, index) => {
    const row = lineTemplate.content.firstElementChild.cloneNode(true);
    for (const field of ["description", "quantity", "price"]) {
      const input = row.querySelector(`.${field}`);
      input.value = line[field];
      input.addEventListener("input", () => {
        line[field] = input.value;
        updateTotals();
        showProblems();
      });
    }
    row.addEventListener("focusout", (event) => {
      // Still inside the same line (e.g. moving from quantity to price)?
      if (row.contains(event.relatedTarget)) return;
      visitedLines.add(line);
      showProblems();
    });
    row.querySelector(".remove").addEventListener("click", () => {
      invoice.lines.splice(index, 1);
      renderLines();
    });
    linesBox.append(row);
  });
  document.getElementById("no-lines").hidden = invoice.lines.length > 0;
  updateTotals();
  showProblems();
  translatePage();
}

// All saved invoices, oldest first. An empty list if nothing is saved
// or the browser won't let us read it.
function loadInvoices() {
  try {
    const saved = JSON.parse(localStorage.getItem(INVOICES_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// The last number given out in each year, e.g. { "2026": 4 }.
// Kept separately so a deleted invoice's number is never given out again.
function loadLastNumbers() {
  try {
    const saved = JSON.parse(localStorage.getItem(LAST_NUMBERS_KEY));
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

// The year an invoice is numbered in: the year of its date.
function yearOf(date) {
  return (date || todayText()).slice(0, 4);
}

// "2026-004"
function numberText(year, count) {
  return `${year}-${String(count).padStart(3, "0")}`;
}

// The last number used in a year, from the remembered counter and,
// to be safe, from the saved invoices themselves.
function lastNumberIn(year, invoices, lastNumbers) {
  let last = lastNumbers[year] || 0;
  for (const saved of invoices) {
    if (saved.number && saved.number.startsWith(`${year}-`)) {
      last = Math.max(last, parseInt(saved.number.slice(5), 10) || 0);
    }
  }
  return last;
}

function nextNumber(date) {
  const year = yearOf(date);
  return numberText(year, lastNumberIn(year, loadInvoices(), loadLastNumbers()) + 1);
}

// Show the number this invoice will get when you save it.
function showNextNumber() {
  document.getElementById("invoice-number").textContent =
    t("invoiceNumber", { number: nextNumber(invoice.date) });
}

// Invoices saved before numbers existed get one, in the order they were saved.
function numberOldInvoices() {
  const invoices = loadInvoices();
  if (invoices.every((saved) => saved.number)) return;
  const lastNumbers = loadLastNumbers();
  for (const saved of invoices) {
    if (saved.number) continue;
    const year = yearOf(saved.date);
    const count = lastNumberIn(year, invoices, lastNumbers) + 1;
    saved.number = numberText(year, count);
    lastNumbers[year] = count;
  }
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    localStorage.setItem(LAST_NUMBERS_KEY, JSON.stringify(lastNumbers));
  } catch {
    // Try again next time the app opens.
  }
}

// "2026-004" → [2026, 4], so numbers can be sorted: 2026-010 comes after 2026-009.
function numberParts(number) {
  const [year, count] = (number || "").split("-");
  return [parseInt(year, 10) || 0, parseInt(count, 10) || 0];
}

// Newest number first.
function byNumberNewestFirst(a, b) {
  const [yearA, countA] = numberParts(a.number);
  const [yearB, countB] = numberParts(b.number);
  return yearB - yearA || countB - countA;
}

// The list of saved invoices under the form.
function renderInvoiceList() {
  const invoices = loadInvoices().sort(byNumberNewestFirst);
  const list = document.getElementById("invoice-list");
  const template = document.getElementById("invoice-row-template");

  document.getElementById("invoices-title").textContent = t("invoicesTitle", { count: invoices.length });
  document.getElementById("no-invoices").hidden = invoices.length > 0;

  list.replaceChildren();
  for (const saved of invoices) {
    const row = template.content.firstElementChild.cloneNode(true);
    row.querySelector(".row-number").textContent = saved.number;
    const client = row.querySelector(".row-client");
    client.textContent = saved.client || t("noClient");
    client.classList.toggle("missing", !saved.client);
    row.querySelector(".row-date").textContent = formatDate(saved.date);
    row.querySelector(".row-total").textContent = formatMoney(totalsOf(saved.lines).total, saved.currency);
    list.append(row);
  }
}

// Show a short message under the Save button. Success messages fade after a few seconds.
let messageTimer;
function showMessage(key, isError, values) {
  const message = document.getElementById("save-message");
  message.textContent = t(key, values);
  message.className = isError ? "error" : "success";
  message.hidden = false;
  clearTimeout(messageTimer);
  if (!isError) {
    messageTimer = setTimeout(() => { message.hidden = true; }, 3000);
  }
}

function saveInvoice() {
  // Check every line, including ones you haven't left yet.
  invoice.lines.forEach((line) => visitedLines.add(line));
  showProblems();
  if (invoice.lines.some((line) => lineProblems(line).length > 0)) {
    showMessage("cantSave", true);
    return;
  }

  // The number is only used up now, when the invoice is really saved.
  const invoices = loadInvoices();
  const lastNumbers = loadLastNumbers();
  const year = yearOf(invoice.date);
  const count = lastNumberIn(year, invoices, lastNumbers) + 1;
  const number = numberText(year, count);
  lastNumbers[year] = count;

  invoices.push({
    number,
    client: invoice.client.trim(),
    date: invoice.date,
    currency: invoice.currency,
    lines: invoice.lines.map((line) => ({
      description: line.description.trim(),
      quantity: numberFrom(line.quantity),
      price: numberFrom(line.price),
    })),
    savedAt: new Date().toISOString(),
  });
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    localStorage.setItem(LAST_NUMBERS_KEY, JSON.stringify(lastNumbers));
  } catch {
    showMessage("saveFailed", true);
    return;
  }

  // Start a fresh invoice.
  invoice = blankInvoice();
  fillForm();
  renderLines();
  renderInvoiceList();
  showMessage("saved", false, { number });
}

// Put the current invoice's client, date and currency into the form.
function fillForm() {
  document.getElementById("client").value = invoice.client;
  document.getElementById("date").value = invoice.date;
  document.getElementById("currency").value = invoice.currency;
  showNextNumber();
}

function setUpForm() {
  const client = document.getElementById("client");
  const date = document.getElementById("date");
  const currency = document.getElementById("currency");

  fillForm();

  document.getElementById("save").addEventListener("click", saveInvoice);
  // Pressing Enter in a field must not save a half-finished invoice.
  document.getElementById("invoice-form").addEventListener("submit", (event) => {
    event.preventDefault();
  });

  client.addEventListener("input", () => { invoice.client = client.value; });
  date.addEventListener("input", () => {
    invoice.date = date.value;
    // A date in another year changes the number, e.g. 2025-… instead of 2026-…
    showNextNumber();
  });
  currency.addEventListener("change", () => {
    invoice.currency = currency.value;
    updateTotals();
  });

  document.getElementById("add-line").addEventListener("click", () => {
    invoice.lines.push(newLine());
    renderLines();
    // Put the cursor in the new line's description.
    linesBox.lastElementChild.querySelector(".description").focus();
  });
}

document.getElementById("language").addEventListener("click", () => {
  language = language === "en" ? "bs" : "en";
  localStorage.setItem(LANGUAGE_KEY, language);
  translatePage();
  showProblems();
  renderInvoiceList();
  showNextNumber();
  document.getElementById("save-message").hidden = true;
});

numberOldInvoices();
setUpForm();
renderLines();
renderInvoiceList();
