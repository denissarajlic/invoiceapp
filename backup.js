// Backup and import: everything the app has saved, in one file.
// Use it to move to another device, or to get your invoices back
// after the browser's data was cleared.
const LAST_BACKUP_KEY = "lastBackup";
// After this many days without a backup, the reminder turns orange.
const BACKUP_REMINDER_DAYS = 30;

// What goes into a backup. "json" values are saved as data, "text" as plain text.
function backupKeys() {
  return {
    [INVOICES_KEY]: "json",
    [LAST_NUMBERS_KEY]: "json",
    [CLIENTS_KEY]: "json",
    [BUSINESS_KEY]: "json",
    [EURO_SYMBOL_KEY]: "text",
  };
}

function makeBackup() {
  const data = {};
  for (const [key, kind] of Object.entries(backupKeys())) {
    const stored = localStorage.getItem(key);
    if (stored === null) continue;
    try {
      data[key] = kind === "json" ? JSON.parse(stored) : stored;
    } catch {
      // A broken value is left out rather than stopping the whole backup.
    }
  }
  return { app: "invoiceapp", version: 1, madeAt: new Date().toISOString(), data };
}

function downloadBackup() {
  const backup = makeBackup();
  const file = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `invoiceapp-backup-${todayText()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);

  try {
    localStorage.setItem(LAST_BACKUP_KEY, todayText());
  } catch {
    // The reminder just won't know about this backup.
  }
  showBackupStatus();
}

// Is this really one of our backup files?
function readBackup(text) {
  try {
    const backup = JSON.parse(text);
    if (backup && backup.app === "invoiceapp" && backup.data && Array.isArray(backup.data[INVOICES_KEY])) {
      return backup;
    }
  } catch {
    // Not JSON at all.
  }
  return null;
}

// Replace everything on this device with what's in the backup, after asking.
function importBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const backup = readBackup(reader.result);
    if (!backup) {
      alert(t("notABackup"));
      return;
    }
    const count = backup.data[INVOICES_KEY].length;
    const madeAt = new Date(backup.madeAt);
    const date = Number.isNaN(madeAt.getTime()) ? "?" : formatDate(dateText(madeAt));
    const here = loadInvoices().length;
    if (!confirm(t("confirmImport", { count, date, here }))) return;

    try {
      for (const key of Object.keys(backupKeys())) {
        const value = backup.data[key];
        if (value === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
        }
      }
    } catch {
      alert(t("importFailed"));
      return;
    }
    alert(t("imported", { count }));
    // Start the app again, so every part shows the imported data.
    location.reload();
  };
  reader.readAsText(file);
}

// "Last backup: 23.10.2026." in the Backup section's title, orange when it's due.
function showBackupStatus() {
  let last = null;
  try {
    last = localStorage.getItem(LAST_BACKUP_KEY);
  } catch {
    // Treated as never.
  }
  const status = document.getElementById("backup-status");
  status.textContent = last ? t("lastBackup", { date: formatDate(last) }) : t("neverBackedUp");

  const daysSince = last
    ? Math.round((Date.parse(todayText()) - Date.parse(last)) / 86400000)
    : Infinity;
  // Only nag when there's something to lose.
  status.classList.toggle("due", daysSince > BACKUP_REMINDER_DAYS && loadInvoices().length > 0);
}

function setUpBackup() {
  document.getElementById("backup").addEventListener("click", downloadBackup);
  const input = document.getElementById("import-file");
  document.getElementById("import").addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    if (input.files[0]) importBackup(input.files[0]);
    // Picking the same file again later should still work.
    input.value = "";
  });
  showBackupStatus();
}
