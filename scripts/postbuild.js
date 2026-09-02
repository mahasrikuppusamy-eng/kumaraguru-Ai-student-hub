import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run build first.');
  process.exit(1);
}

// 1. Create 404.html fallback for SPA routing on GitHub Pages
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
}

// 2. Create .nojekyll so GitHub Pages does not ignore underscore files or assets
const noJekyllPath = path.join(distDir, '.nojekyll');
fs.writeFileSync(noJekyllPath, '');

// 3. Clean docs directory and copy dist into docs for docs-based GitHub Pages
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.cpSync(distDir, docsDir, { recursive: true });

console.log('✅ Postbuild complete: 404.html, .nojekyll, and docs/ updated successfully.');
