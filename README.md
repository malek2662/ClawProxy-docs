# ClawRouter - GitHub Pages

This directory contains the professional, dashboard-inspired web page designed specifically to be hosted on GitHub Pages for the **ClawRouter** project. It combines the `README`, `QUICKSTART`, `OPENCLAW_PROVIDERS`, and `Knowledge Base` information into an interactive, beautifully styled React application.

## 🚀 Running Locally

To view the website on your local machine before deploying:

1. Make sure you have Node.js installed.
2. Navigate into this directory:
   ```bash
   cd github-page
   ```
3. Install the dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173/` (or whatever URL Vite gives you in the terminal).

---

## 🌐 Deploying to GitHub Pages (Automated)

The most professional way to deploy this site is using **GitHub Actions**. This is already configured for you in `.github/workflows/deploy.yml`.

### 1. Create a New Repository
1. Create a new repository on GitHub (e.g., `ClawProxy-docs`).
2. **Important**: If your repository name is NOT `<your-username>.github.io`, you must update `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/ClawProxy-docs/', // Change this to your repo name!
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
npm install
npm run dev
```

---

## Notes on Markdown Content

The markdown files (`ClawRouter-Knowledge-Base.md`, `README.md`, etc.) are imported directly as raw text from the root of the project using Vite's `?raw` feature. You **do not** need to update the website codebase every time you alter your markdown documentation! Just modify the root `.md` files as you normally would, and the next time you run `npm run build` or `npm run deploy`, the changes will automatically sync into the frontend website.
