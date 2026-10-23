// The invoice being filled in. Nothing is saved yet (that's Feature 4).
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
      });
    }
    row.querySelector(".remove").addEventListener("click", () => {
      invoice.lines.splice(index, 1);
      renderLines();
    });
    linesBox.append(row);
  });
  document.getElementById("no-lines").hidden = invoice.lines.length > 0;
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
  currency.addEventListener("change", () => { invoice.currency = currency.value; });

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
});

setUpForm();
renderLines();
