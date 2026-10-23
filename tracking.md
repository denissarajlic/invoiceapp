# What the app can do

This file lists only what works right now. Planned features are not here.

Last updated: 23 Oct 2026

## New invoice
- The page shows a form for a new invoice.
- Type the **client** name.
- The **date** starts as today. You can change it.
- Choose the **currency**: KM or EUR. It starts as KM.
- The invoice starts with one empty line. Each line has a **description**, a **quantity** (starts at 1) and a **price**.
- **+ Add line** adds a new empty line, and the cursor jumps to its description.
- **✕** removes a line. You can remove all of them.
- On a phone, each line shows the description on top, with quantity and price below it and the amount under them. On a computer, a line fits on one row.

## Calculations
- Each line shows its **amount**: quantity × price.
- Below the lines the invoice shows:
  - **Amount without VAT** (Iznos bez PDV-a): all line amounts added together.
  - **VAT 17%** (PDV 17%): 17% of the amount without VAT.
  - **Total** (Ukupno za platiti): amount without VAT + VAT.
- The prices you type are without VAT. The app adds the 17% on top.
- Every amount is rounded to 2 decimals. VAT is worked out from the rounded line amounts.
- Everything updates straight away as you type, and when you add or remove a line.
- An empty quantity or price counts as 0.

## Duplicate an invoice
- Each invoice in the list has a **Duplicate** button (Dupliraj).
- It opens a copy in the form with the same client, currency and lines, **today's date**, a due date 15 days from today, and the next number. The page scrolls up to the form.
- Above the form it says **Copy of 2026-001** (Kopija fakture 2026-001), with a **Cancel** button.
- The copy is only saved when you press **Save**, and you can change anything first.
- **Cancel** throws the copy away and starts a new, empty invoice. No number is used up.
- If you've already typed something into the form, the app asks first whether to throw it away and open the copy.

## Edit an invoice
- Each invoice in the list has an **Edit** button (Uredi), next to Duplicate.
- It opens the invoice in the form. The title says **Edit invoice** (Uredi fakturu), and the page scrolls up to it.
- Above the form it says **Editing 2026-003** (Uređuješ fakturu 2026-003), with a **Cancel** button. The invoice is also highlighted in blue in the list.
- You can change everything: client, date, due date, currency and lines.
- The invoice **keeps its number**, even if you change the date to another year.
- The due date stays as it was saved, even if you change the invoice date. You can still change the due date yourself.
- **Save** replaces the old version: "Invoice 2026-003 updated." The form then starts a new, empty invoice.
- **Cancel** throws the changes away. The saved invoice stays as it was.
- The same line checks apply: a line with a problem can't be saved.
- If you've already typed something into the form, the app asks first whether to throw it away.

## Delete an invoice
- Each invoice in the list has a red **Delete** button (Obriši).
- The app asks first: "Delete invoice 2026-003? This can't be undone." Only **OK** deletes it.
- The invoice disappears from the list straight away.
- A deleted number is **never given out again**. If you delete `2026-003`, the next new invoice still gets `2026-004` (or the next free number), so there's a gap.
- If you delete the invoice that's open for editing, the form goes back to a new, empty invoice.

## Filter by month
- Above the list: **Show** (Prikaži) with a menu: **All months** (Svi mjeseci), then every month that has invoices, newest first, e.g. "October 2026" / "Oktobar 2026.".
- The month comes from the invoice date.
- Picking a month shows only that month's invoices. The title counts only those, e.g. **Invoices (4)**.
- With a month picked, a box shows that month's **amount without VAT**, **VAT 17%** and **total**. KM and EUR are added up separately.
- The Summary boxes above it still count all invoices, whatever month is picked.
- If you save an invoice from another month while a month is picked, the list switches to that invoice's month.
- If the picked month has no invoices left (for example after deleting), the list goes back to All months.
- The app doesn't remember the picked month. After reloading, it shows All months.

## Export to CSV
- **⬇ Export (CSV)** (Izvoz) next to the month menu downloads a file that opens in Excel or Google Sheets.
- It contains exactly the invoices the list shows: the picked month, or all of them.
- One row per invoice, in list order: invoice number, client, date, due date, amount without VAT, VAT, total, currency (KM or EUR) and status (paid, unpaid or overdue). The first row has the column names, in the app's language.
- Made for Excel with Bosnian settings: `;` between columns, amounts like `1250,00` (so Excel can add them up), dates like `23.10.2026`. Č, ć, š, đ and ž come out correctly.
- The file is named after what's in it, e.g. `invoices-2026-10.csv`, `invoices-all.csv`, or in Bosnian `fakture-2026-10.csv`, `fakture-svi.csv`.
- A client name starting with `=`, `+`, `-` or `@` gets a `'` in front in the file, so Excel never treats it as a formula.
- CSV and PDF files saved inside the app's folder are ignored by git, so test files don't end up in the project.

## Paid / unpaid
- Each invoice is **Unpaid** (Neplaćeno) or **Paid** (Plaćeno). A new invoice starts as Unpaid, and so does a duplicate.
- The list shows a label on each invoice: grey **Unpaid** or green **Paid**.
- **Mark as paid** / **Mark as unpaid** in the list switches it straight away.
- In the form there's a **Paid** checkbox, next to the currency. Use it when you create or edit an invoice. It's saved when you press Save.
- If you switch an invoice in the list while it's open in the form, the form's checkbox changes too.
- The total of all unpaid invoices is in the **Unpaid** box of the Summary.

## Clients
- Under the client name there are two more fields: **Address** (Adresa) and **ID number (JIB)** (ID broj).
- When you type in the client name, the browser suggests your saved clients. Picking one, or typing a saved name exactly, fills in their address and JIB. Capitals don't matter.
- Saving an invoice with a **new** client name adds that client to the client list, with the address and JIB from the invoice.
- Saving an invoice for a client who's **already** on the list doesn't change the list, even if you typed a different address on the invoice.
- The clients of invoices saved before the client list existed were added to it automatically.
- **👥 Clients (3)** (Klijenti) near the bottom of the page lists all clients A–Z, with their address and JIB. Tap it to open or close it.
- **Edit** opens a client's name, address and JIB to change. **Save** keeps the changes and **Cancel** throws them away. The name can't be empty, and two clients can't have the same name.
- **Delete** removes a client after asking first.
- **Invoices keep their own copy** of the client's name, address and JIB. Changing or deleting a client never changes invoices that were already made.
- Edit and Duplicate also bring back the invoice's address and JIB.

## Note
- The form has an optional **Note** field (Napomena), e.g. "Please include the invoice number when you pay."
- It's saved with the invoice and comes back with Edit and Duplicate.

## Print / PDF
- Each invoice in the list has a **Print** button (Štampaj). It opens the browser's print window.
- The printout shows only the invoice, with no buttons or menus, on an A4 page:
  - top left: your business details from Settings
  - top right: **Invoice** (Faktura), with the invoice number, date and due date
  - **Bill to** (Kupac): the client's name, address and JIB, as saved on the invoice
  - a table of the lines: number, description, quantity, price and amount
  - amount without VAT, VAT 17% and the total, at the bottom right
  - the note, if there is one
- It's printed in the language the app is in at that moment.
- Quantities are printed Bosnian style too, e.g. `1,5`.
- A long invoice continues on a second page, and a line is never cut in half.
- **PDF:** in the print window, choose "Save as PDF" as the printer. On iPhone, use the Share button in the print view.

## Overdue
- An **unpaid** invoice whose due date has passed is **overdue**. Its label turns red and says how late it is: **Overdue · 12 days** (Kasni 12 dana). Its due date in the list turns red too.
- An invoice due **today** isn't overdue yet. It becomes overdue tomorrow, at "1 day".
- Marking an invoice as paid removes the overdue label.
- The total of all overdue invoices is in the **Overdue** box of the Summary.
- In the CSV export, the status column says "Overdue" (Kasni s plaćanjem) for these invoices.

## Summary
- Above the invoice list: **Summary** (Pregled), with four boxes:
  - **This month** (Ovaj mjesec): the total with VAT of all invoices dated this month, with the amount without VAT underneath ("w/o VAT" / "bez PDV-a").
  - **This year** (Ova godina): the same for this year.
  - **Unpaid** (Neplaćeno): the total with VAT of all unpaid invoices, including overdue ones.
  - **Overdue** (Kasni s plaćanjem): the total with VAT of all overdue invoices. The box turns red when something is overdue.
- This month and This year count paid and unpaid invoices. They go by invoice date, so an invoice dated later this month already counts.
- KM and EUR are added up separately, each on its own line in the box. A currency with nothing in it isn't shown. With nothing at all, the box shows `0,00 KM`.
- The boxes always count all invoices, whatever month is picked in the list.
- They update straight away when you save, edit, delete or mark an invoice as paid.
- On a phone the boxes are 2 × 2. On a wide screen they're 4 in a row.
- The days are counted when the page loads or the list changes. If the page stays open past midnight, reload it to update them.

## Amount format
- Every amount has two decimals and the currency, Bosnian style: `1.250,00 KM`. There's a dot between thousands and a comma before the decimals.
- This is the same in English and in Bosnian.
- It's used everywhere: line amounts, the three totals and the invoice list.
- Euros are shown as `1.250,00 EUR` or `1.250,00 €`, whichever you choose in Settings.
- Prices are still **typed** with a dot, like `12.50`.

## Checking lines
- The app checks every line while you type. A problem is shown in red under that line, and the wrong field gets a red border:
  - **Description is missing.** (Nedostaje opis.)
  - **Quantity can't be negative.** (Količina ne može biti negativna.)
  - **Price can't be negative.** (Cijena ne može biti negativna.)
- A new line doesn't complain about its empty description until you leave the line (for example, click somewhere else or add another line).
- A quantity or price of **0** is fine, and so are decimals like `1.5`.
- The message goes away as soon as you fix the problem.
- An invoice with no lines or no client name is fine.

## Saving
- **Save** stores the invoice. You see "Invoice 2026-004 saved." and the form starts again as a new, empty invoice.
- If any line has a problem, Save refuses: "Not saved. Fix the lines marked in red first." Every line is checked, including one you haven't left yet. The message goes away once the lines are fixed.
- Pressing Enter in a field does not save.
- Invoices are still there after you close and reopen the browser.
- They're saved in the browser on the device you use. There's no account and no login. Each device keeps its own invoices.
- Clearing the browser's website data deletes the saved invoices.

## Invoice number
- Every saved invoice gets a number: the year, then a counter. For example `2026-001`, `2026-002`, …
- The top right of the form shows the number the invoice will get, e.g. **No. 2026-004** (Br. 2026-004).
- The year comes from the invoice date. Each year starts again at `001`. If you change the date to another year, the number shown changes too, e.g. to `2025-…`.
- The number is only used up when you press **Save**. An invoice you never save doesn't use a number.
- After saving, the message shows the number: "Invoice 2026-004 saved."
- The app remembers the last number it gave out in each year, so a number is never given out twice.
- Invoices saved before numbering existed got numbers automatically, in the order they were saved.

## Due date
- Each invoice has a **due date** (Rok plaćanja), next to the date.
- A new invoice is due **15 days after the invoice date**.
- Until you change the due date yourself, it moves along when you change the invoice date.
- Once you've changed it yourself, it stays as you set it, even if you change the invoice date afterwards.
- A due date before the invoice date is allowed.
- Invoices saved before due dates existed are shown as due 15 days after their date.

## Invoice list
- Under the form: **Invoices (3)** (Fakture), with every saved invoice.
- Sorted by number, newest first. `2026-010` comes before `2026-009`, and 2026 invoices come before 2025 ones.
- Each invoice shows its **number**, **client**, **date** (like `23.10.2026.`), **due date** (like "Due 07.11.2026." / "Rok 07.11.2026.") and **total** with VAT, in its own currency.
- An invoice without a client name shows "(no client)" (bez klijenta) in grey.
- A newly saved invoice appears at the top of the list straight away.
- With no saved invoices, it says "No saved invoices yet."
- On a phone, each invoice shows the number and total on top, then the client on the left with the date and due date on the right. On a wide screen, all of that fits on one row.
- Under each invoice are its paid/unpaid label and its buttons: **Mark as paid**, **Print**, **Edit**, **Duplicate** and **Delete**.

## Settings
- **⚙ Settings** (Postavke) is at the bottom of the page. Tap it to open or close it.
- **Your business** (Tvoja firma): business name, address, ID number (JIB) and bank account (žiro račun).
  - They're saved automatically as you type. You see "✓ Saved automatically".
  - They're printed in the top-left corner of every invoice. Empty fields are left out.
  - They aren't stored in each invoice. If you change them, older invoices also show the new details when you print them again.
- **Show euros as:** `1.250,00 EUR` or `1.250,00 €`. It starts as EUR.
- Changing it updates every amount on the page straight away, including saved invoices in the list.
- The app remembers your choice.

## Using it like an app
- The app is online at https://denissarajlic.github.io/invoiceapp/
- **iPhone:** open the link in Safari, tap Share, then **Add to Home Screen**. **Android:** in Chrome, tap **Install app**. **Windows:** in Chrome or Edge, click the install icon in the address bar.
- Installed, it gets its own icon (a white invoice on blue) and the name "Invoices", and it opens full screen without the browser's address bar.
- It keeps a copy of itself on the device. After you've opened it once with internet, it also opens and works without internet.
- With internet, it always loads the newest version. A device gets a change only after it has been pushed to GitHub (`git push`). If an update doesn't show, close the app fully and open it again.
- Offline mode and installing only work on the online version. Opening `index.html` as a file on the computer works as before, but without them.
- The browser tab also shows the invoice icon.
- On iPhone, the home-screen app and Safari keep **separate** invoices. Pick one and stick with it.
- The online invoiceapp and clockapp share the language choice: switching one to Bosnian switches the other too. Their data stays separate.

## Language
- The app works in **English** and **Bosnian**.
- The **🌐** button at the top right switches between them.
- The first time you open the app, it uses the device's language: Bosnian if the device is set to Bosnian, Croatian or Serbian, otherwise English. After that, it remembers your choice.
- What you type yourself (client name and descriptions) is never translated.

## Known problems
- The invoice in the form can't be printed until it's saved. Print is only in the list.
- Clients can only be added by saving an invoice. There's no "add client" button in the Clients section.
- An invoice you haven't saved is lost if you reload or close the page.
- A line with a problem is still counted in the totals on screen until you fix it.
