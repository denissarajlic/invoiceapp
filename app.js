// Saved invoices live in the browser under this name.
const INVOICES_KEY = "invoices";
const LAST_NUMBERS_KEY = "lastInvoiceNumbers";
const EURO_SYMBOL_KEY = "euroSymbol";

// A new invoice is due this many days after its date.
const DAYS_TO_PAY = 15;

// The invoice being filled in.
// Prices are typed without VAT; the app adds 17% on top.
let invoice = blankInvoice();

const linesBox = document.getElementById("lines");
const lineTemplate = document.getElementById("line-template");

function blankInvoice() {
  const date = todayText();
  return {
    client: "",
    date,
    dueDate: addDays(date, DAYS_TO_PAY),
    // Becomes true once you pick a due date yourself. Until then the due date
    // moves along when you change the invoice date.
    dueDateChanged: false,
    currency: "KM",
    lines: [newLine()],
  };
}

// "2026-10-23" + 15 days → "2026-11-07". Empty if there's no date.
function addDays(date, days) {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  return dateText(new Date(year, month - 1, day + days));
}

// A date as "2026-10-23", the format a date field uses.
function dateText(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Invoices saved before due dates existed are due 15 days after their date.
function dueDateOf(saved) {
  return saved.dueDate || addDays(saved.date, DAYS_TO_PAY);
}

function newLine() {
  return { description: "", quantity: "1", price: "" };
}

// Today's date as "2026-10-23".
function todayText() {
  return dateText(new Date());
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

// How euros are written: "EUR" or "€". Chosen in Settings.
let euroChoice = localStorage.getItem(EURO_SYMBOL_KEY) === "€" ? "€" : "EUR";

function euroSymbol() {
  return euroChoice;
}

// Bosnian style: 125000 cents → "1.250,00 KM", or "1.250,00 €" for euros.
function formatMoney(cents, currency = invoice.currency) {
  const sign = cents < 0 ? "-" : "";
  const [whole, decimals] = (Math.abs(cents) / 100).toFixed(2).split(".");
  const withDots = whole.replace(/\B(?=(\d{3})+$)/g, ".");
  const symbol = currency === "EUR" ? euroSymbol() : currency;
  return `${sign}${withDots},${decimals} ${symbol}`;
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
// An invoice being edited keeps its own number.
function showNextNumber() {
  document.getElementById("invoice-number").textContent =
    t("invoiceNumber", { number: invoice.editing || nextNumber(invoice.date) });
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
    const due = dueDateOf(saved);
    row.querySelector(".row-due").textContent = due ? t("dueOn", { date: formatDate(due) }) : "";
    row.querySelector(".row-total").textContent = formatMoney(totalsOf(saved.lines).total, saved.currency);
    row.dataset.number = saved.number;
    row.classList.toggle("editing", saved.number === invoice.editing);
    const edit = row.querySelector(".edit");
    edit.textContent = t("edit");
    edit.addEventListener("click", () => editInvoice(saved));
    const duplicate = row.querySelector(".duplicate");
    duplicate.textContent = t("duplicate");
    duplicate.addEventListener("click", () => duplicateInvoice(saved));
    const remove = row.querySelector(".delete");
    remove.textContent = t("delete");
    remove.addEventListener("click", () => deleteInvoice(saved.number));
    list.append(row);
  }
}

// Delete a saved invoice after asking. Its number is never given out again,
// because the last number used each year is remembered separately.
function deleteInvoice(number) {
  if (!confirm(t("confirmDelete", { number }))) return;
  const invoices = loadInvoices().filter((saved) => saved.number !== number);
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  } catch {
    alert(t("deleteFailed"));
    return;
  }
  // The invoice open in the form is gone, so start a new one.
  if (invoice.editing === number) {
    openInForm(blankInvoice());
  }
  renderInvoiceList();
  showNextNumber();
}

// Has anything been typed into the form yet?
function formHasContent() {
  return invoice.client.trim() !== "" ||
    invoice.lines.some((line) => line.description.trim() !== "" || line.price !== "");
}

// Put another invoice into the form (a copy, one to edit, or a new one) and scroll up to it.
function openInForm(newInvoice) {
  invoice = newInvoice;
  fillForm();
  renderLines();
  showFormNote();
  document.getElementById("save-message").hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// A copy with today's date and the next number. It is only saved when you press Save.
function duplicateInvoice(saved) {
  if (formHasContent() && !confirm(t("confirmReplace"))) return;
  const copy = blankInvoice();
  copy.client = saved.client;
  copy.currency = saved.currency;
  copy.lines = saved.lines.map((line) => ({
    description: line.description,
    quantity: String(line.quantity),
    price: String(line.price),
  }));
  copy.copyOf = saved.number;
  openInForm(copy);
}

// Open a saved invoice in the form to change it. Nothing changes until you press Save.
function editInvoice(saved) {
  if (formHasContent() && !confirm(t("confirmReplace"))) return;
  const opened = blankInvoice();
  opened.editing = saved.number;
  opened.client = saved.client;
  opened.date = saved.date;
  opened.dueDate = dueDateOf(saved);
  // The saved due date stays, even if you change the date.
  opened.dueDateChanged = true;
  opened.currency = saved.currency;
  opened.lines = saved.lines.map((line) => ({
    description: line.description,
    quantity: String(line.quantity),
    price: String(line.price),
  }));
  openInForm(opened);
}

// Above the form: "Copy of 2026-001" or "Editing 2026-003", with a Cancel button.
// The title also says whether this is a new invoice or one being edited.
function showFormNote() {
  document.getElementById("form-title").textContent = t(invoice.editing ? "editInvoice" : "newInvoice");

  const note = document.getElementById("form-note");
  note.hidden = !invoice.copyOf && !invoice.editing;
  if (invoice.editing) {
    document.getElementById("form-note-text").textContent = t("editing", { number: invoice.editing });
  } else if (invoice.copyOf) {
    document.getElementById("form-note-text").textContent = t("copyOf", { number: invoice.copyOf });
  }

  // Mark the invoice being edited in the list.
  for (const row of document.querySelectorAll(".invoice-row")) {
    row.classList.toggle("editing", row.dataset.number === invoice.editing);
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

  const invoices = loadInvoices();
  const lastNumbers = loadLastNumbers();
  const toSave = {
    client: invoice.client.trim(),
    date: invoice.date,
    dueDate: invoice.dueDate,
    currency: invoice.currency,
    lines: invoice.lines.map((line) => ({
      description: line.description.trim(),
      quantity: numberFrom(line.quantity),
      price: numberFrom(line.price),
    })),
  };

  let number;
  let messageKey;
  const editedIndex = invoices.findIndex((saved) => saved.number === invoice.editing);
  if (invoice.editing && editedIndex !== -1) {
    // An existing invoice keeps its number; the new version replaces the old one.
    number = invoice.editing;
    messageKey = "updated";
    invoices[editedIndex] = {
      ...invoices[editedIndex],
      ...toSave,
      updatedAt: new Date().toISOString(),
    };
  } else {
    // The number is only used up now, when the invoice is really saved.
    const year = yearOf(invoice.date);
    const count = lastNumberIn(year, invoices, lastNumbers) + 1;
    number = numberText(year, count);
    lastNumbers[year] = count;
    messageKey = "saved";
    invoices.push({ number, ...toSave, savedAt: new Date().toISOString() });
  }

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
  showFormNote();
  renderInvoiceList();
  showMessage(messageKey, false, { number });
}

// Put the current invoice's client, date and currency into the form.
function fillForm() {
  document.getElementById("client").value = invoice.client;
  document.getElementById("date").value = invoice.date;
  document.getElementById("due-date").value = invoice.dueDate;
  document.getElementById("currency").value = invoice.currency;
  showNextNumber();
}

function setUpForm() {
  const client = document.getElementById("client");
  const date = document.getElementById("date");
  const dueDate = document.getElementById("due-date");
  const currency = document.getElementById("currency");

  fillForm();

  document.getElementById("save").addEventListener("click", saveInvoice);
  // Throw the copy or the changes away and start a new, empty invoice.
  // No number is used up, and an edited invoice stays as it was saved.
  document.getElementById("cancel-form").addEventListener("click", () => {
    openInForm(blankInvoice());
  });
  // Pressing Enter in a field must not save a half-finished invoice.
  document.getElementById("invoice-form").addEventListener("submit", (event) => {
    event.preventDefault();
  });

  client.addEventListener("input", () => { invoice.client = client.value; });
  date.addEventListener("input", () => {
    invoice.date = date.value;
    if (!invoice.dueDateChanged) {
      invoice.dueDate = addDays(invoice.date, DAYS_TO_PAY);
      dueDate.value = invoice.dueDate;
    }
    // For a new invoice, a date in another year changes the number, e.g. 2025-… instead of 2026-…
    showNextNumber();
  });
  dueDate.addEventListener("input", () => {
    invoice.dueDate = dueDate.value;
    invoice.dueDateChanged = true;
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

function setUpSettings() {
  const choice = document.getElementById("euro-symbol");
  choice.value = euroSymbol();
  choice.addEventListener("change", () => {
    euroChoice = choice.value;
    try {
      localStorage.setItem(EURO_SYMBOL_KEY, choice.value);
    } catch {
      // Not remembered, but still used until the page is closed.
    }
    // Show every amount again with the new symbol.
    updateTotals();
    renderInvoiceList();
  });
}

document.getElementById("language").addEventListener("click", () => {
  language = language === "en" ? "bs" : "en";
  localStorage.setItem(LANGUAGE_KEY, language);
  translatePage();
  showProblems();
  renderInvoiceList();
  showNextNumber();
  showFormNote();
  document.getElementById("save-message").hidden = true;
});

numberOldInvoices();
setUpForm();
setUpSettings();
renderLines();
renderInvoiceList();
showFormNote();
