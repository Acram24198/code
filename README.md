# CODE — Pigpen Encoder

Minimal black-and-white Pigpen encoder for code.jeremydouglas.com.

## Deploy

Upload `index.html`, `style.css`, `app.js`, `CNAME` and `README.md` to the root of a GitHub repository. Enable GitHub Pages from the `main` branch, `/ (root)`. Configure the `code` CNAME record in Cloudflare to point to your GitHub Pages hostname, then set `code.jeremydouglas.com` as the Pages custom domain.

## Usage

Type text or upload an English-language image. After OCR completes, review and edit the extracted text. Click ENCODE. Export as PNG/SVG, copy the PNG image, or print/save as PDF. The additional 2–0 shift is not performed.

Image recognition uses Tesseract.js from a CDN and needs internet access to load the library. OCR is performed in the browser.
