// The client list: name, address and ID number (JIB) of everyone you invoice.
// Each invoice keeps its own copy of these details, so changing or deleting
// a client here never changes invoices that were already made.
const CLIENTS_KEY = "clients";

// The client being changed in the Clients section, if any.
let editingClientId = null;

function loadClients() {
  try {
    const saved = JSON.parse(localStorage.getItem(CLIENTS_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Returns false if the browser didn't allow saving.
function storeClients(clients) {
  try {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
    return true;
  } catch {
    return false;
  }
}

// Names are matched without caring about capitals or extra spaces.
function sameName(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function findClient(name, clients = loadClients()) {
  if (!name.trim()) return undefined;
  return clients.find((client) => sameName(client.name, name));
}

function newClientId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Called when an invoice is saved: a client name not on the list yet is added.
// A client that's already on the list is left as it is.
function addClientIfNew({ name, address, jib }) {
  const clients = loadClients();
  if (!name.trim() || findClient(name, clients)) return;
  clients.push({ id: newClientId(), name: name.trim(), address: address.trim(), jib: jib.trim() });
  storeClients(clients);
}

// The first time the app opens with a client list, the clients of the
// invoices saved so far are added to it.
function addClientsFromInvoices() {
  if (localStorage.getItem(CLIENTS_KEY) !== null) return;
  const clients = [];
  for (const saved of loadInvoices()) {
    if (saved.client && !findClient(saved.client, clients)) {
      clients.push({
        id: newClientId(),
        name: saved.client,
        address: saved.clientAddress || "",
        jib: saved.clientJib || "",
      });
    }
  }
  storeClients(clients);
}

function byName(a, b) {
  return a.name.localeCompare(b.name, "bs", { sensitivity: "base" });
}

// The suggestions under the client name field, and the Clients section.
function renderClients() {
  const clients = loadClients().sort(byName);

  const options = document.getElementById("client-options");
  options.replaceChildren(...clients.map((client) => {
    const option = document.createElement("option");
    option.value = client.name;
    return option;
  }));

  document.getElementById("clients-title").textContent = t("clientsTitle", { count: clients.length });
  document.getElementById("no-clients").hidden = clients.length > 0;

  const list = document.getElementById("client-list");
  list.replaceChildren(...clients.map((client) =>
    client.id === editingClientId ? clientEditRow(client) : clientRow(client)));
}

function clientRow(client) {
  const row = document.getElementById("client-row-template").content.firstElementChild.cloneNode(true);
  row.querySelector(".client-name").textContent = client.name;
  const details = [client.address, client.jib && `JIB ${client.jib}`].filter(Boolean);
  row.querySelector(".client-details").textContent = details.join(" · ");

  const edit = row.querySelector(".edit");
  edit.textContent = t("edit");
  edit.addEventListener("click", () => {
    editingClientId = client.id;
    renderClients();
    document.querySelector(".client-edit .client-name-input").focus();
  });

  const remove = row.querySelector(".delete");
  remove.textContent = t("delete");
  remove.addEventListener("click", () => deleteClient(client));
  return row;
}

function clientEditRow(client) {
  const row = document.getElementById("client-edit-template").content.firstElementChild.cloneNode(true);
  const name = row.querySelector(".client-name-input");
  const address = row.querySelector(".client-address-input");
  const jib = row.querySelector(".client-jib-input");
  name.value = client.name;
  address.value = client.address;
  jib.value = client.jib;
  for (const element of row.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }

  const error = row.querySelector(".error");
  row.querySelector(".save-client").addEventListener("click", () => {
    const clients = loadClients();
    if (!name.value.trim()) {
      error.textContent = t("clientNameMissing");
      error.hidden = false;
      return;
    }
    const sameNameClient = findClient(name.value, clients);
    if (sameNameClient && sameNameClient.id !== client.id) {
      error.textContent = t("clientExists");
      error.hidden = false;
      return;
    }
    const stored = clients.find((one) => one.id === client.id);
    if (stored) {
      stored.name = name.value.trim();
      stored.address = address.value.trim();
      stored.jib = jib.value.trim();
    }
    if (!storeClients(clients)) {
      error.textContent = t("saveFailed");
      error.hidden = false;
      return;
    }
    editingClientId = null;
    renderClients();
  });

  row.querySelector(".cancel-client").addEventListener("click", () => {
    editingClientId = null;
    renderClients();
  });
  return row;
}

function deleteClient(client) {
  if (!confirm(t("confirmDeleteClient", { name: client.name }))) return;
  if (!storeClients(loadClients().filter((one) => one.id !== client.id))) {
    alert(t("deleteFailed"));
    return;
  }
  renderClients();
}
