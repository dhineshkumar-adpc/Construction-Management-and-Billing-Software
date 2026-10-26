# Construction Management and Billing

Offline rental / site billing desktop app (Electron, Windows portable `.exe`).
Data is stored in the `data` folder **next to the .exe** (not on C: unless you put the .exe there).

## Customise
Open **⚙ Settings** inside the app: company name, tagline, logo, address, phone, email, website, GSTIN.
They are used on screen, in bills, PDFs and WhatsApp messages. Saved in `data/CMB_Branding.json`.

## Build the .exe (GitHub Actions)
1. Upload all files (including `.github/workflows/build.yml`) to a GitHub repository.
2. Open **Actions → Build Windows EXE → Run workflow** (or push a tag such as `v1.0.0`).
3. Download `Construction_Management_and_Billing.exe` from the run's **Artifacts** (or from **Releases** for tags).

Local build on Windows: `npm install` then `npm run dist` (output in `dist/`).

See the PDF guide (English + தமிழ்) for the full step-by-step instructions.
