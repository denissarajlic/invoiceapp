// The invoice being filled in. Nothing is saved yet (that's Feature 4).
// Prices are typed without VAT; the app adds 17% on top.
const invoice = {
  client: "",
  date: todayText(),
  currency: "KM",
  lines: [newLine()],
};

const linesBox = document.getElementById("lines");
const lineTemplate = document.getElementById("line-template");

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

function setUpForm() {
  const client = document.getElementById("client");
  const date = document.getElementById("date");
  const currency = document.getElementById("currency");

  client.value = invoice.client;
  date.value = invoice.date;
  currency.value = invoice.currency;

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
});

setUpForm();
renderLines();
