// Installing the app on a phone or computer.
// Android (Chrome) and Windows (Chrome, Edge) let the app offer its own
// Install button. iPhone doesn't, so there it's Share → Add to Home Screen.

// Kept until you press Install. Only exists when the browser allows installing.
let installPrompt = null;

// Already opened as an installed app (from the home screen icon)?
function runningInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
}

function showInstallButtons() {
  const canInstall = installPrompt !== null && !runningInstalled();
  document.getElementById("install-top").hidden = !canInstall;
  document.getElementById("install-button").hidden = !canInstall;
  // Once installed, the install section isn't needed any more.
  document.getElementById("install-section").hidden = runningInstalled();
}

async function install() {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  // The browser only lets the prompt be used once.
  installPrompt = null;
  showInstallButtons();
}

function setUpInstall() {
  window.addEventListener("beforeinstallprompt", (event) => {
    // Show our own button instead of the browser's small banner.
    event.preventDefault();
    installPrompt = event;
    showInstallButtons();
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    showInstallButtons();
  });
  document.getElementById("install-top").addEventListener("click", install);
  document.getElementById("install-button").addEventListener("click", install);
  showInstallButtons();
}
