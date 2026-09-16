import fs from "fs";
import path from "path";

const PREFIX = ".murai-home";
const srcDir = process.argv[2];
const outFile = process.argv[3];

function processRules(css, prefix) {
  let result = "";
  let i = 0;
  const n = css.length;

  while (i < n) {
    if (/\s/.test(css[i])) {
      result += css[i];
      i += 1;
      continue;
    }
    if (css.startsWith("/*", i)) {
      const end = css.indexOf("*/", i + 2);
      result += css.slice(i, end === -1 ? n : end + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (css[i] === "@") {
      const nameMatch = css.slice(i).match(/^@([\w-]+)/);
      const name = nameMatch ? nameMatch[1].toLowerCase() : "";
      if (["media", "supports", "layer", "container"].includes(name)) {
        const brace = css.indexOf("{", i);
        result += css.slice(i, brace + 1);
        let depth = 1;
        let j = brace + 1;
        while (j < n && depth > 0) {
          if (css.startsWith("/*", j)) {
            const cend = css.indexOf("*/", j + 2);
            j = cend === -1 ? n : cend + 2;
            continue;
          }
          if (css[j] === "{") depth += 1;
          else if (css[j] === "}") depth -= 1;
          j += 1;
        }
        result += processRules(css.slice(brace + 1, j - 1), prefix);
        result += "}";
        i = j;
        continue;
      }
      if (name === "keyframes" || name === "-webkit-keyframes") {
        const brace = css.indexOf("{", i);
        let depth = 1;
        let j = brace + 1;
        while (j < n && depth > 0) {
          if (css[j] === "{") depth += 1;
          else if (css[j] === "}") depth -= 1;
          j += 1;
        }
        result += css.slice(i, j);
        i = j;
        continue;
      }
      if (["import", "charset", "namespace"].includes(name)) {
        const semi = css.indexOf(";", i);
        result += css.slice(i, semi + 1);
        i = semi + 1;
        continue;
      }
      if (name === "font-face") {
        const brace = css.indexOf("{", i);
        const close = css.indexOf("}", brace);
        result += css.slice(i, close + 1);
        i = close + 1;
        continue;
      }
    }

    const brace = css.indexOf("{", i);
    if (brace === -1) {
      result += css.slice(i);
      break;
    }
    const selectors = css.slice(i, brace);
    const prefixed = selectors
      .split(",")
      .map((sel) => {
        const s = sel.trim();
        if (!s) return sel;
        if (s === ":root" || s === "html" || s === "body" || s === "html body") return prefix;
        if (/^(html|body)([.#:\[:\s]|$)/.test(s)) return s.replace(/^(html|body)/, prefix);
        if (s.startsWith(prefix)) return s;
        return `${prefix} ${s}`;
      })
      .join(", ");

    let depth = 1;
    let j = brace + 1;
    while (j < n && depth > 0) {
      if (css[j] === "{") depth += 1;
      else if (css[j] === "}") depth -= 1;
      j += 1;
    }
    result += prefixed + css.slice(brace, j);
    i = j;
  }
  return result;
}

function rewriteUrls(css) {
  return css
    .replace(/url\(\s*['"]?\.\.\/images\/([^'")]+)['"]?\s*\)/g, "url('/murai/$1')")
    .replace(/url\(\s*['"]?images\/([^'")]+)['"]?\s*\)/g, "url('/murai/$1')");
}

const files = [
  "css-style.css",
  "css-header.css",
  "css-home.css",
  "css-diwali-banner.css",
  "css-responsive.css",
];

const reset = `/* MuRa homepage — scoped clone of murai-website-wine.vercel.app */
@import url("https://fonts.googleapis.com/css2?family=Great+Vibes&family=Jost:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap");

.murai-home {
  --color-primary: #cf0653;
  --color-primary-dark: #a00543;
  --color-primary-light: #e80761;
  --color-secondary: #cf0653;
  --color-secondary-dark: #a00543;
  --color-cream: #FFFDE9;
  --color-cream-dark: #f3ece8;
  --color-white: #FFFFFF;
  --color-text: #2B2A29;
  --color-text-muted: #4a4a4a;
  --color-border: #ededed;
  --font-heading: "Playfair Display", Georgia, serif;
  --font-body: "Jost", "Lato", "Segoe UI", sans-serif;
  --suruchi-primary: #cf0653;
  --suruchi-primary-dark: #a00543;
  --suruchi-secondary: #cf0653;
  --suruchi-dark: #2B2A29;
  --suruchi-gray: #4a4a4a;
  --suruchi-gray-light: #979797;
  --suruchi-border: #ededed;
  --suruchi-bg: #fafafa;
  --suruchi-white: #ffffff;
  --suruchi-cream: #FFFDE9;
  --suruchi-beige: #f3ece8;
  --suruchi-nav-height: 64px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --transition: 0.3s ease;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-cream);
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
  isolation: isolate;
}

.murai-home *,
.murai-home *::before,
.murai-home *::after {
  box-sizing: border-box;
}

.murai-home img {
  max-width: 100%;
  height: auto;
  display: block;
}

.murai-home a {
  color: inherit;
  text-decoration: none;
}

.murai-home ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.murai-home h1,
.murai-home h2,
.murai-home h3,
.murai-home h4,
.murai-home p {
  margin: 0;
}

.murai-home button {
  cursor: pointer;
  font-family: inherit;
  border: none;
  background: none;
}

.murai-home input,
.murai-home textarea,
.murai-home select {
  font-family: inherit;
  font-size: inherit;
}

`;

let combined = reset;
for (const file of files) {
  const raw = fs.readFileSync(path.join(srcDir, file), "utf8");
  combined += `\n/* ===== ${file} ===== */\n`;
  combined += processRules(rewriteUrls(raw), PREFIX);
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, combined);
console.log(`Wrote ${outFile} (${combined.length} chars)`);
