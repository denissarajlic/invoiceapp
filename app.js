// Saved invoices live in the browser under this name.
const INVOICES_KEY = "invoices";

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

// "292.50 KM". The Bosnian style (292,50 KM) comes in Feature 8.
function formatMoney(cents) {
  return `${(cents / 100).toFixed(2)} ${invoice.currency}`;
}

// Work out every line amount and the three totals, and show them.
function updateTotals() {
  const amounts = linesBox.querySelectorAll(".amount");
  invoice.lines.forEach((line, index) => {
    amounts[index].textContent = formatMoney(lineCents(line));
  });

  const subtotal = invoice.lines.reduce((sum, line) => sum + lineCents(line), 0);
  const vat = Math.round(subtotal * VAT_RATE);
  document.getElementById("subtotal").textContent = formatMoney(subtotal);
  document.getElementById("vat").textContent = formatMoney(vat);
  document.getElementById("total").textContent = formatMoney(subtotal + vat);
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

function showSavedCount() {
  const count = loadInvoices().length;
  document.getElementById("saved-count").textContent = t("savedCount").replace("{count}", count);
}

// Show a short message under the Save button. Success messages fade after a few seconds.
let messageTimer;
function showMessage(key, isError) {
  const message = document.getElementById("save-message");
  message.textContent = t(key);
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
  invoices.push({
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
  } catch {
    showMessage("saveFailed", true);
    return;
  }

  // Start a fresh invoice.
  invoice = blankInvoice();
  fillForm();
  renderLines();
  showSavedCount();
  showMessage("saved", false);
}

// Put the current invoice's client, date and currency into the form.
function fillForm() {
  document.getElementById("client").value = invoice.client;
  document.getElementById("date").value = invoice.date;
  document.getElementById("currency").value = invoice.currency;
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
  date.addEventListener("input", () => { invoice.date = date.value; });
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
  showSavedCount();
  document.getElementById("save-message").hidden = true;
});

setUpForm();
renderLines();
showSavedCount();
