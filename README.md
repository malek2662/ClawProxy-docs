# ClawRouter - GitHub Pages

This directory contains the professional, dashboard-inspired web page designed specifically to be hosted on GitHub Pages for the **ClawRouter** project. It combines the `README`, `QUICKSTART`, `OPENCLAW_PROVIDERS`, and `Knowledge Base` information into an interactive, beautifully styled React application.

## 🚀 Running Locally

To view the website on your local machine before deploying:

1. Make sure you have Node.js and [pnpm](https://pnpm.io) installed.
2. Navigate into this directory:
   ```bash
   cd github-page
   ```
3. Install the dependencies (if you haven't already):
   ```bash
   pnpm install
   ```
4. Start the Vite development server:
   ```bash
   pnpm run dev
   ```
5. Open your browser and navigate to `http://localhost:5174/` (or whatever URL Vite gives you in the terminal).

---

## 🌐 Deploying to GitHub Pages (Automated)

The most professional way to deploy this site is using **GitHub Actions**. This is already configured for you in `.github/workflows/deploy.yml`.

### 1. Create a New Repository
1. Create a new repository on GitHub (e.g., `ClawProxy-docs`).
2. **Base path**: the site is served from the custom domain root (`clawrouter.qzz.io`), so `vite.config.js` uses `base: '/'`. If you instead host under `https://<username>.github.io/<repo-name>/`, change it to:
   ```javascript
   export default defineConfig({
     base: '/<repo-name>/', // Change this to your repo name!
     // ...
   })
   ```

### 2. Upload the Project
Upload all files inside this `github-page` directory to your new repository.

### 3. Push to GitHub
When you push your code to the `main` branch, the **GitHub Action** will automatically:
1. Install dependencies.
2. Build the production site.
3. Deploy it to a new branch called `gh-pages`.

### 4. Final Activation
1. Go to your repo **Settings** > **Pages**.
2. Under **Build and deployment** > **Branch**, ensure it is set to `gh-pages` and `/(root)`.
3. Click **Save**.

Your site will be live at `https://<username>.github.io/<repo-name>/`!

---

## 🛠️ Local Development

```bash
pnpm install
pnpm run dev
```

---

## Notes on Markdown Content

The markdown files in `src/docs-v2/` are imported directly as raw text using Vite's `?raw` feature. You **do not** need to update the website codebase every time you alter your markdown documentation! Just modify the `.md` files as you normally would, and the next time you run `pnpm run build`, the changes will automatically sync into the frontend website.

Every docs page is prerendered to static HTML at build time (`scripts/prerender.js`), which also generates `sitemap.xml` and `llms.txt` — so every route is crawlable without JavaScript.
