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
- On a phone, each line shows the description on top, with quantity and price below it. On a computer, a line fits on one row.

## Language
- The app works in **English** and **Bosnian**.
- The **🌐** button at the top right switches between them.
- The first time you open the app, it uses the device's language: Bosnian if the device is set to Bosnian, Croatian or Serbian, otherwise English. After that, it remembers your choice.
- What you type yourself (client name and descriptions) is never translated.

## Known problems
- Nothing is saved yet. Reloading or closing the page empties the form.
- Nothing is calculated yet: there are no line amounts or totals.
