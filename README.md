# ddbml — Bookmarklet Manager

A Python CLI tool that compiles JavaScript bookmarklets into `javascript:` URLs, generates a
drag-and-drop HTML gallery, and applies custom icons/labels to the Firefox Bookmarks Toolbar.

## Features

- **Minify JS** → `javascript:` URLs (handles template literals, regex, comments, `#` escaping)
- **SVG icons** → base64 data URIs + per-bookmarklet CSS rules for Firefox panel icons
- **Gallery page** (`docs/index.html`) — dark-themed cards with drag-and-drop onto any browser's toolbar
- **`patchff`** — symlink icons and CSS into a Firefox profile, add `@import` to `userChrome.css`

## Requirements

- Python 3.8+
- (Optional) Firefox profile path configured via `blm config`

## Quick start

```bash
./blm config set ff_profile ~/.mozilla/firefox/xxxx.default-release
./blm build           # generates docs/index.html + docs/bookmarks_panel.css
./blm patchff         # links icons/CSS into the Firefox profile
```

Then open `docs/index.html` in Firefox, enable the Bookmarks Toolbar (`Ctrl+Shift+B`)
and drag the bookmarklet cards onto it.

## Commands

```text
build        Build index.html + bookmarks_panel.css from src/
list         List all bookmarklets (filename, label, icon)
add <name>   Create a new bookmarklet from the template
edit <name>  Open bookmarklet source in your editor
rm <name>    Delete a bookmarklet
config       Manage config: print / set / get / reset
patchff      Patch Firefox profile (symlink CSS + icons, update userChrome.css)
get          git pull
put [-m MSG] build + git add + commit + push
```

## Bookmarklet sources

| File | Label | Description |
|---|---|---|
| `copy.js` | Copy element text | Click any element to copy its text |
| `ddg.js` | Search on DuckDuckGo | Re-run the current search on DuckDuckGo |
| `edit.js` | Edit mode | Toggle `document.designMode` on/off |
| `kpfinder.js` | KPFinder | Search Kinopoisk (requires API token) |
| `logins.js` | Search logins/passwords | BugMeNot + Google links for the current site |
| `passwords.js` | Show passwords | Reveal hidden password fields |
| `qr.js` | QR | Generate a QR code for the current page |
| `safeselect.js` | Safe select | Remove all links to enable safe text selection |
| `telegram.js` | Send to Telegram | Share the current URL via Telegram |
| `undisable.js` | unDisable element | Remove `disabled` attribute from clicked elements |
| `unlock.js` | unlock right click | Remove right-click/select/copy restrictions |
| `wback.js` | WBack Machine | Wayback Machine links (calendar / last saved / save) |

## Config

Stored at `~/.config/blm/config.json`:

| Key | Description |
|---|---|
| `ff_profile` | Path to the Firefox profile directory |
| `editor` | Editor to open with `blm edit` (default: `$EDITOR` or `nano`) |
| `author` | Author name for new bookmarklet templates |

## License

Personal project — see source for details.