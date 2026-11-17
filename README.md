# Visa Document Organiser

A document checklist with category navigation, completion status, notes and local PDF/image previews. The interface is adapted from the supplied VisaApplication source.

[Try the browser demo](https://visa-document-organiser.ranakaharian1.workers.dev/) · [See the portfolio](https://ranova.vercel.app/technical-projects)

## Features

- Six fictional checklist items in Application, Identity and Supporting documents.
- Category list, item list and document reader on desktop.
- Back navigation between categories, items and the reader on a phone.
- Per-item notes and a Ready for review checkbox.
- Local preview of PDF, PNG, JPEG and WebP files up to 10 MB.
- Checklist export as JSON, including notes and completion status.
- Reset sample and a built-in usage guide.

## How to use

1. Open a category, then select a checklist item.
2. Enter a note and select **Ready for review** when appropriate.
3. Select **Save checklist item**.
4. Choose a sample PDF or image to preview it. **Remove preview** removes it from this page.
5. Select **Export checklist** to download the notes and completion status.
6. On a phone, use **Back** to move from the reader to the item list or categories.

Checklist notes and status save in browser storage. File previews stay in the page’s memory until reload or close. Exported JSON contains checklist text and status. Keep any original documents in your own document storage.

The example categories are an organisational starting point. Replace them with the checklist supplied for your application.

## Run locally

Install Node.js 22 or newer, download this repository and extract it. From the extracted folder run:

```powershell
node local-server.cjs
```

Open **http://127.0.0.1:8118/**, or use `Start-Local.cmd` on Windows. Keep the terminal open while using the app.

## Deploy your own copy

Serve this folder on static HTTPS hosting. Use `index.html`, `style.css`, `app.js` and `_headers` as the public files. The public demo uses local browser data and requires no backend account.

The original uploaded source contained family-specific examples and a private file-service connection. This public edition uses a fictional checklist and local previews. Its repository begins with the clean edition.

## Languages and tools

HTML, CSS, JavaScript and a small Node.js local launcher. Hosted demo on Cloudflare Workers.
