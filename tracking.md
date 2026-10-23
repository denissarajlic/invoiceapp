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
- Amounts show the currency you picked, e.g. `292.50 KM` or `292.50 EUR`.
- An empty quantity or price counts as 0.

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
- **Save** stores the invoice. You see "Invoice saved." and the form starts again as a new, empty invoice.
- If any line has a problem, Save refuses: "Not saved. Fix the lines marked in red first." Every line is checked, including one you haven't left yet. The message goes away once the lines are fixed.
- Pressing Enter in a field does not save.
- Below the form: **Saved invoices: 3**, the number of invoices saved so far.
- Invoices are still there after you close and reopen the browser.
- They're saved in the browser on the device you use. There's no account and no login. Each device keeps its own invoices.
- Clearing the browser's website data deletes the saved invoices.

## Language
- The app works in **English** and **Bosnian**.
- The **🌐** button at the top right switches between them.
- The first time you open the app, it uses the device's language: Bosnian if the device is set to Bosnian, Croatian or Serbian, otherwise English. After that, it remembers your choice.
- What you type yourself (client name and descriptions) is never translated.

## Known problems
- Saved invoices can't be seen, opened or changed yet. You only see how many there are.
- An invoice you haven't saved is lost if you reload or close the page.
- Amounts use a dot for decimals and have no thousands separator yet (`1250.00 KM`, not `1.250,00 KM`).
- A line with a problem is still counted in the totals on screen until you fix it.
