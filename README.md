# CODE — Pigpen Encoder

Static website for `code.jeremydouglas.com`.

## Deployment
1. Upload `index.html`, `style.css`, `app.js`, and `CNAME` to the **root** of your GitHub repository.
2. GitHub repository → Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.
3. In Cloudflare DNS for `jeremydouglas.com`, create a CNAME record: **Name:** `code`; **Target:** `<your-github-username>.github.io`; **Proxy:** DNS only (recommended initially).
4. In GitHub Pages settings, set Custom domain to `code.jeremydouglas.com`, then enable Enforce HTTPS once the certificate is ready.

The site performs OCR in the browser using Tesseract.js (downloaded from CDN). Photos are not uploaded to a server by this code. Standard Pigpen encoding is local JavaScript. No 2–0 shift is applied.

## Notes
- Review extracted text before clicking Encode.
- PNG, SVG, image clipboard, and Print / Save PDF are supported (clipboard depends on browser permissions).
- Pigpen symbol orientations follow the A–I/J–R tic-tac-toe and S–V/W–Z X-grid mapping; make sure the recipient uses the same key orientation.
