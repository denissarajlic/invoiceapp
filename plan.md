# Invoice App – Plan

This is the plan: what we want to build. What already works is in [tracking.md](tracking.md).

Plan agreed: 23 Oct 2026

We build one feature at a time, in this order. Each feature gets its own commit, and `tracking.md` is updated in that same commit.

## Features

- [x] **1. Invoice form**
  - Client name, invoice date (today by default), currency: **KM** or **EUR**.
  - Lines with **description**, **quantity** and **price**. Add or remove lines.
  - The app works in **English** and **Bosnian**, switched with the 🌐 button. This is built in from the start, so every later feature comes in both languages.
  - What you type yourself (client names, descriptions) is never translated.

- [x] **2. Calculations (VAT / PDV 17%)**
  - Each line's amount = quantity × price.
  - Amount without VAT / Iznos bez PDV-a = all line amounts added together.
  - VAT 17% / PDV 17% = amount without VAT × 0.17, rounded to 2 decimals.
  - Total / Ukupno za platiti = amount without VAT + VAT.
  - The prices you type are **without** VAT.
  - Everything updates straight away as you type.

- [x] **3. Checking lines**
  - The app refuses a line with an empty description, a negative quantity or a negative price, and shows which line has the problem.
  - A quantity or price of **0** is allowed.
  - Decimals in quantity are allowed (e.g. `1.5`).
  - An invoice **with no lines** or **no client name** is still allowed.

- [x] **4. Saving**
  - Invoices are still there after you close and reopen the app.
  - They're saved in the browser on the device, like clockapp. No account, no login.
  - Each device keeps its own invoices.
  - **Save** refuses to save while any line has a problem (from Feature 3).

- [x] **5. Invoice number**
  - Each new invoice gets the next number automatically: `2026-001`, `2026-002`, …
  - Numbering starts again at `001` each new year.

- [x] **6. Invoice list**
  - All invoices, sorted by number, newest first.
  - Each row shows number, client, date, due date and total.

- [x] **7. Due date**
  - Set automatically to 15 days after the invoice date. It can be changed by hand.
  - If the invoice date is changed later, the due date stays as it is.
  - A due date before the invoice date is allowed.
  - Shown in the invoice list too.

- [x] **8. Amount format**
  - Two decimals and the currency, Bosnian style: `1.250,00 KM`.
  - For euros, Settings lets you choose `EUR` or `€`.
  - Prices are typed with a dot: `12.50`.

- [x] **9. Duplicate an invoice**
  - Makes a copy with the next number, today's date and a new due date (today + 15). Same client, currency and lines.
  - The copy opens in the form first and is only saved when you press **Save**.
  - If you cancel, the number is not used up.

- [x] **10. Edit an invoice**
  - Open an invoice, change anything, then **Save** or **Cancel**.
  - The invoice number can't be changed.
  - The same checks as in Feature 3 apply.

- [x] **11. Delete an invoice**
  - The app asks first: "Delete invoice 2026-003?" → Yes / No.
  - A deleted number is never given out again, so there's a gap.

- [x] **12. Paid / unpaid**
  - Each invoice is Paid or Unpaid. New invoices start as Unpaid.
  - The list shows the status. No separate filter.
  - Shows the total of all unpaid invoices.
  - KM and EUR are always added up separately: `1.250,00 KM + 300,00 €`. This applies to all totals in the app.

- [x] **13. Client list**
  - Pick a saved client when creating an invoice, or type a new one.
  - Saved per client: name, address, ID number (JIB).
  - A client is added to the list automatically when you save an invoice with a new client.
  - Clients can be edited and deleted.
  - Old invoices keep the client details they had when they were made.

- [x] **14. Print / PDF**
  - A **Print** button opens a clean printable invoice. "Save as PDF" in the print window makes a PDF.
  - Shows your business details, the client, number, dates, lines and totals.
  - Printed in the language the app is in.
  - An optional note at the bottom, e.g. "Please include the invoice number when you pay".

- [x] **15. Settings (your business details)**
  - Business name, address, ID number (JIB), bank account.
  - Entered once and used on every invoice: they fill the empty top-left corner of the printout from Feature 14.
  - Also holds the `EUR` / `€` choice.

- [x] **16. Filter by month**
  - Pick a month to show only that month's invoices (by invoice date), or **All**.
  - Shows that month's totals: without VAT, VAT, total.

- [x] **17. Export to CSV**
  - Downloads a file that opens in Excel or Google Sheets.
  - Exports what the list shows (the picked month, or all).
  - One row per invoice: number, client, date, due date, without VAT, VAT, total, currency, paid/unpaid.
  - Set up for Excel with Bosnian settings (`;` between columns, `1250,00`).

- [x] **18. Overdue**
  - An unpaid invoice past its due date is marked **Overdue** in red, with the number of days late.
  - An invoice due today isn't overdue yet. It becomes overdue tomorrow.
  - Shows the overdue total.

- [x] **19. Summary**
  - Boxes at the top of the invoice list: **This month**, **This year**, **Unpaid**, **Overdue**.
  - This month and this year show both the amount without VAT and the total with VAT.

- [ ] **20. Install it like an app**
  - Online on GitHub Pages, like clockapp.
  - iPhone: Safari → Share → Add to Home Screen. Android and Windows: **Install app** in Chrome or Edge.
  - Opens full screen with its own icon and works offline.

## Maybe later
- Backup and import, to move invoices between devices.
- More business details: PDV number, phone, email, logo.
