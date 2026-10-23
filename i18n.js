// All the app's text in English and Bosnian.
// t("key") returns the text in the chosen language.
const LANGUAGE_KEY = "language";

const translations = {
  en: {
    languageName: "English",
    changeLanguage: "Change language",
    newInvoice: "New invoice",
    client: "Client",
    clientPlaceholder: "Client name",
    address: "Address",
    jib: "ID number (JIB)",
    clientsTitle: "👥 Clients ({count})",
    noClients: "No clients yet. A client is added here when you save an invoice with a new client name.",
    clientNameMissing: "The name can't be empty.",
    clientExists: "There's already a client with this name.",
    confirmDeleteClient: "Delete client \"{name}\"? Invoices already made for them stay as they are.",
    date: "Date",
    dueDate: "Due date",
    dueOn: "Due {date}",
    currency: "Currency",
    lines: "Lines",
    description: "Description",
    descriptionPlaceholder: "e.g. Web design",
    quantity: "Quantity",
    price: "Price",
    removeLine: "Remove line",
    addLine: "+ Add line",
    noLines: "No lines yet. Press \"+ Add line\".",
    amount: "Amount",
    withoutVat: "Amount without VAT",
    vat: "VAT 17%",
    total: "Total",
    missingDescription: "Description is missing.",
    negativeQuantity: "Quantity can't be negative.",
    negativePrice: "Price can't be negative.",
    save: "Save",
    saved: "Invoice {number} saved.",
    invoiceNumber: "No. {number}",
    cantSave: "Not saved. Fix the lines marked in red first.",
    saveFailed: "Not saved. The browser didn't allow it.",
    invoicesTitle: "Invoices ({count})",
    noInvoices: "No saved invoices yet.",
    noClient: "(no client)",
    editInvoice: "Edit invoice",
    edit: "Edit",
    editing: "Editing {number}",
    updated: "Invoice {number} updated.",
    paid: "Paid",
    unpaid: "Unpaid",
    markPaid: "Mark as paid",
    markUnpaid: "Mark as unpaid",
    unpaidTotal: "Unpaid: {amount}",
    duplicate: "Duplicate",
    delete: "Delete",
    confirmDelete: "Delete invoice {number}? This can't be undone.",
    deleteFailed: "Not deleted. The browser didn't allow it.",
    copyOf: "Copy of {number}",
    cancel: "Cancel",
    confirmReplace: "Throw away the invoice you're filling in and open the copy instead?",
    settings: "⚙ Settings",
    euroSymbol: "Show euros as",
  },
  bs: {
    languageName: "Bosanski",
    changeLanguage: "Promijeni jezik",
    newInvoice: "Nova faktura",
    client: "Klijent",
    clientPlaceholder: "Ime klijenta",
    address: "Adresa",
    jib: "ID broj (JIB)",
    clientsTitle: "👥 Klijenti ({count})",
    noClients: "Još nema klijenata. Klijent se dodaje ovdje kad sačuvaš fakturu s novim imenom klijenta.",
    clientNameMissing: "Ime ne može biti prazno.",
    clientExists: "Već postoji klijent s ovim imenom.",
    confirmDeleteClient: "Obrisati klijenta \"{name}\"? Već napravljene fakture za tog klijenta ostaju kakve jesu.",
    date: "Datum",
    dueDate: "Rok plaćanja",
    dueOn: "Rok {date}",
    currency: "Valuta",
    lines: "Stavke",
    description: "Opis",
    descriptionPlaceholder: "npr. Izrada web stranice",
    quantity: "Količina",
    price: "Cijena",
    removeLine: "Ukloni stavku",
    addLine: "+ Dodaj stavku",
    noLines: "Još nema stavki. Pritisni \"+ Dodaj stavku\".",
    amount: "Iznos",
    withoutVat: "Iznos bez PDV-a",
    vat: "PDV 17%",
    total: "Ukupno za platiti",
    missingDescription: "Nedostaje opis.",
    negativeQuantity: "Količina ne može biti negativna.",
    negativePrice: "Cijena ne može biti negativna.",
    save: "Sačuvaj",
    saved: "Faktura {number} je sačuvana.",
    invoiceNumber: "Br. {number}",
    cantSave: "Nije sačuvano. Prvo ispravi stavke označene crvenom bojom.",
    saveFailed: "Nije sačuvano. Preglednik to nije dozvolio.",
    invoicesTitle: "Fakture ({count})",
    noInvoices: "Još nema sačuvanih faktura.",
    noClient: "(bez klijenta)",
    editInvoice: "Uredi fakturu",
    edit: "Uredi",
    editing: "Uređuješ fakturu {number}",
    updated: "Faktura {number} je izmijenjena.",
    paid: "Plaćeno",
    unpaid: "Neplaćeno",
    markPaid: "Označi kao plaćeno",
    markUnpaid: "Označi kao neplaćeno",
    unpaidTotal: "Neplaćeno: {amount}",
    duplicate: "Dupliraj",
    delete: "Obriši",
    confirmDelete: "Obrisati fakturu {number}? Ovo se ne može poništiti.",
    deleteFailed: "Nije obrisano. Preglednik to nije dozvolio.",
    copyOf: "Kopija fakture {number}",
    cancel: "Odustani",
    confirmReplace: "Odbaciti fakturu koju popunjavaš i otvoriti kopiju?",
    settings: "⚙ Postavke",
    euroSymbol: "Prikaži eure kao",
  },
};

// First visit: use the phone's or computer's language if it is Bosnian
// (or close to it), otherwise English. After that, remember the choice.
function startingLanguage() {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (saved in translations) return saved;
  const device = (navigator.language || "en").slice(0, 2);
  return ["bs", "hr", "sr"].includes(device) ? "bs" : "en";
}

let language = startingLanguage();

// t("saved", { number: "2026-004" }) puts the number in place of {number}.
function t(key, values = {}) {
  let text = translations[language][key];
  for (const [name, value] of Object.entries(values)) {
    text = text.replace(`{${name}}`, value);
  }
  return text;
}

// Put the right text into every element marked with data-i18n.
function translatePage() {
  document.documentElement.lang = language;
  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }
  for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  }
  for (const element of document.querySelectorAll("[data-i18n-title]")) {
    element.title = t(element.dataset.i18nTitle);
  }
  for (const element of document.querySelectorAll("[data-i18n-label]")) {
    element.setAttribute("aria-label", t(element.dataset.i18nLabel));
  }
}
