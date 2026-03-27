# `[ D0RKER ]` — Google Hacking GUI

<div align="center">

**A cyberpunk-themed, browser-based GUI for building and launching Google Dork queries.**

[![License: MIT](https://img.shields.io/badge/License-MIT-00ff41?style=flat-square&labelColor=0a0a0f)](LICENSE)
![HTML](https://img.shields.io/badge/HTML-pure-00cc33?style=flat-square&labelColor=0a0a0f&logo=html5&logoColor=00ff41)
![CSS](https://img.shields.io/badge/CSS-vanilla-00cc33?style=flat-square&labelColor=0a0a0f&logo=css3&logoColor=00ff41)
![JS](https://img.shields.io/badge/JS-vanilla-00cc33?style=flat-square&labelColor=0a0a0f&logo=javascript&logoColor=00ff41)
![No Dependencies](https://img.shields.io/badge/dependencies-none-00ff41?style=flat-square&labelColor=0a0a0f)
![Works Offline](https://img.shields.io/badge/offline-ready-00ff41?style=flat-square&labelColor=0a0a0f)

> ⚠️ **Authorised targets only.** For bug bounty, CTF, and educational use.

</div>

---

## Overview

D0RKER is a fully client-side GUI for constructing, previewing, and launching **Google Dork** queries. No backend, no API keys, no install — just open `index.html` and go.

Built with a terminal/cyberpunk aesthetic: scanlines, phosphor-green glow, and monospace everything.

---

## Features

| | Feature | Description |
|---|---|---|
| 🔧 | **Query Builder** | Compose dorks from domain, raw operators, exact phrases, and exclusions |
| 🗂️ | **Operator Sidebar** | One-click insert for all major Google operators |
| ⚡ | **22+ Quick Dork Templates** | Admin panels, open dirs, exposed configs, API endpoints, DB dumps & more |
| 🔗 | **Advanced Combos** | Pre-built multi-operator dorks for common recon scenarios |
| 🌐 | **Multi-Engine Support** | Google · Bing · DuckDuckGo · Shodan |
| 🎨 | **Syntax Highlighting** | Live preview with operator and phrase coloring |
| 🕓 | **Query History** | Persisted via `localStorage`, up to 40 entries |
| 📋 | **Clipboard Copy** | Copies raw dork string with `file://` fallback |
| ⌨️ | **Keyboard Shortcuts** | `Ctrl+Enter` to launch · `Esc` to clear |
| 📴 | **Fully Offline** | Zero dependencies, zero network requests |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/nullRdx/d0rker.git
cd d0rker

# 2. Open in browser — no server required
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

**Optional — serve locally** (for stricter browser environments):

```bash
# Python 3
python3 -m http.server 8080
# → http://localhost:8080

# Node
npx serve .
```

---

## Project Structure

```
d0rker/
├── index.html      ← markup & layout
├── style.css       ← all styles (variables, scanlines, animations, responsive)
├── app.js          ← all logic (query builder, history, engine routing)
├── LICENSE
└── README.md
```

---

## Operator Reference

### Core Operators

| Operator | Description |
|---|---|
| `site:` | Restrict results to a specific domain |
| `inurl:` | Match a string within the URL |
| `intitle:` | Match a string in the page title |
| `intext:` | Match a string in the page body |
| `filetype:` | Filter by file extension |
| `ext:` | Alias for `filetype:` |
| `cache:` | View Google's cached version of a page |
| `allinurl:` | All terms must appear in the URL |
| `allintitle:` | All terms must appear in the page title |
| `allintext:` | All terms must appear in the page body |
| `related:` | Find sites similar to a given URL |
| `info:` | Show Google's info about a URL |
| `link:` | Pages that link to a URL |
| `inanchor:` | Match a string in anchor link text |

### Boolean & Logic

| Operator | Description |
|---|---|
| `OR` | Boolean OR between terms |
| `AND` | Boolean AND (implicit by default) |
| `-term` | Exclude a term from results |
| `"phrase"` | Match an exact phrase |

---

## Quick Dork Templates

Templates are pre-filled with your target domain. Click any in the sidebar.

| Tag | Template | What it finds |
|---|---|---|
| `INFO` | `site:{target} filetype:pdf` | Public PDF documents |
| `INFO` | `site:{target} filetype:xls OR xlsx OR csv` | Spreadsheet files |
| `ADMIN` | `site:{target} inurl:admin` | Admin panels |
| `ADMIN` | `site:{target} inurl:login` | Login pages |
| `ADMIN` | `site:{target} inurl:wp-admin` | WordPress admin |
| `ADMIN` | `site:{target} inurl:phpmyadmin` | phpMyAdmin interfaces |
| `EXPOSE` | `site:{target} intitle:"index of"` | Open directory listings |
| `EXPOSE` | `site:{target} intitle:"index of" password` | Password file dumps |
| `CONFIG` | `site:{target} ext:env OR cfg OR conf` | Config files |
| `DB` | `site:{target} ext:sql OR db OR sqlite` | Database files |
| `API` | `site:{target} inurl:api OR api/v1 OR api/v2` | API endpoints |
| `API` | `site:{target} inurl:swagger OR api-docs` | Swagger / API docs |
| `ERROR` | `site:{target} intext:"sql syntax"` | SQL error pages |
| `ERROR` | `site:{target} intext:"PHP Parse error"` | PHP error pages |
| `LOG` | `site:{target} filetype:log` | Log files |
| `BACKUP` | `site:{target} inurl:backup OR bak` | Backup directories |
| `BACKUP` | `site:{target} ext:bak OR old OR backup` | Backup file extensions |
| `GIT` | `site:{target} inurl:.git` | Exposed .git repos |
| `PASTE` | `inurl:"{target}" site:pastebin.com` | Pastebin leaks |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` | Launch search in new tab |
| `Esc` | Clear all fields |

---

## Ethical & Legal Use

D0RKER is a **query builder** — it constructs a search URL and opens it in your browser. It makes no direct requests to any target.

```
✅  Authorised penetration testing
✅  Bug bounty programs (within defined scope)
✅  CTF challenges
✅  Security research & education
❌  Unauthorised access to systems you do not own or have permission to test
```

> Misuse may violate the **IT Act 2000** (India), **Computer Fraud and Abuse Act** (USA), and equivalent laws in your jurisdiction. You are responsible for how you use this tool.

---

## Roadmap

- [ ] Export query history as `.txt` / `.json`
- [ ] Import custom dork template lists
- [ ] Shodan-specific operator sidebar
- [ ] Dork chaining / multi-step builder

---

## Author

**nullRdx** · [github.com/Radhesh-Mutreja](https://github.com/Radhesh-Mutreja)

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.
