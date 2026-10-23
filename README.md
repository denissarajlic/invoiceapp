# My Invoice App

![App icon](icons/icon-192.png)

A simple invoicing app for personal use. Make invoices with VAT (PDV 17%), keep track of what's paid, and print them or save them as PDF. It works on your phone, even without internet.

**Open the app:** https://denissarajlic.github.io/invoiceapp/

I built it while learning git, one feature branch at a time.

## What it does
- **Invoices:** client, date, due date (15 days later), currency (KM or EUR) and lines with description, quantity and price.
- **VAT:** amount without VAT, VAT 17% and total, worked out as you type. Amounts are shown Bosnian style: `1.250,00 KM`.
- **Numbers:** every invoice gets the next number automatically, like `2026-001`. A number is never given out twice.
- **List:** all invoices, newest first, with Print, Edit, Duplicate and Delete. Filter by month.
- **Paid / unpaid / overdue:** see what's still owed and what's late.
- **Summary:** totals for this month and this year, plus unpaid and overdue.
- **Clients:** saved automatically, with address and ID number (JIB).
- **Print / PDF:** a clean A4 invoice with your business details.
- **Export:** a CSV file for Excel with Bosnian settings.
- **English and Bosnian:** switch with the 🌐 button.
- **Works like a phone app:** add it to your home screen, and it opens full screen and works offline.

The full, up-to-date list of what works is in [tracking.md](tracking.md). The original plan is in [plan.md](plan.md).

## Install on iPhone
1. Open https://denissarajlic.github.io/invoiceapp/ in **Safari**.
2. Tap **Share**, then **Add to Home Screen**, then **Add**.
3. Open the app from the new icon. After opening it once with internet, it also works offline.

On Android, open the link in Chrome and choose **Install app**. On a Windows computer, open it in Chrome or Edge and click the **Install** icon in the address bar.

## Your data
Invoices, clients and settings are saved only in the browser on your own device. Nothing is sent to a server, and there is no account. Each device keeps its own invoices, and there's no backup yet. Clearing the browser's website data deletes them.

## Run it on a computer
No installation is needed. Download or clone the project and double-click `index.html`. Offline mode and installing only work on the online version.

## Files
| File | What it is |
|---|---|
| `index.html` | The page itself |
| `style.css` | Colors, layout and the printed invoice |
| `app.js` | The invoice form, saving, numbers, the list and the summary |
| `clients.js` | The client list |
| `print.js` | Printing an invoice |
| `export.js` | Exporting to CSV |
| `i18n.js` | All texts in English and Bosnian |
| `sw.js` | Keeps a copy of the app on the device for offline use |
| `manifest.webmanifest` | App name and icon for the home screen |
| `icons/` | The app icon in different sizes |
| `tracking.md` | Plain-language list of every working feature |
| `plan.md` | The plan the app was built from |
