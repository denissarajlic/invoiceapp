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

## Paid / unpaid
- Each invoice is **Unpaid** (Neplaćeno) or **Paid** (Plaćeno). A new invoice starts as Unpaid, and so does a duplicate.
- The list shows a label on each invoice: grey **Unpaid** or green **Paid**.
- **Mark as paid** / **Mark as unpaid** in the list switches it straight away.
- In the form there's a **Paid** checkbox, next to the currency. Use it when you create or edit an invoice. It's saved when you press Save.
- If you switch an invoice in the list while it's open in the form, the form's checkbox changes too.
- Above the list: **Unpaid: 1.250,00 KM + 300,00 €**, the total with VAT of all unpaid invoices.
- KM and EUR are added up separately, never mixed. A currency with nothing unpaid isn't shown. With nothing unpaid at all, it shows `0,00 KM`.

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
- Under each invoice are its paid/unpaid label and its buttons: **Mark as paid**, **Edit**, **Duplicate** and **Delete**.

## Settings
- **⚙ Settings** (Postavke) is at the bottom of the page. Tap it to open or close it.
- **Show euros as:** `1.250,00 EUR` or `1.250,00 €`. It starts as EUR.
- Changing it updates every amount on the page straight away, including saved invoices in the list.
- The app remembers your choice.

## Language
- The app works in **English** and **Bosnian**.
- The **🌐** button at the top right switches between them.
- The first time you open the app, it uses the device's language: Bosnian if the device is set to Bosnian, Croatian or Serbian, otherwise English. After that, it remembers your choice.
- What you type yourself (client name and descriptions) is never translated.

## Known problems
- An invoice you haven't saved is lost if you reload or close the page.
- A line with a problem is still counted in the totals on screen until you fix it.
