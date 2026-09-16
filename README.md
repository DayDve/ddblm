[![Русский](https://img.shields.io/badge/Русский-blue?style=flat&logo=readme&logoColor=white)](README.ru.md)
[![12 bookmarklets](https://img.shields.io/badge/12-bookmarklets-ff69b4?style=flat&logo=bookmarklets&logoColor=white)](https://daydve.github.io/ddblm/)

# ddblm — my bookmarklets

A collection of bookmarklets I've been collecting, writing and rewriting for years, plus a small
CLI helper (`blm`) that makes developing and managing them easier.

Live gallery: **https://daydve.github.io/ddblm/**

## What is a bookmarklet

A bookmarklet is an ordinary browser bookmark that stores a small JS snippet instead of a URL.
Click it and the script runs on the current page.

Unlike browser extensions, a bookmarklet needs no installation, no permissions and no add-on
store. Drag it onto the toolbar and it just works.

## Why

Websites keep getting in the way: they block text selection and copying, hide passwords behind
asterisks, disable buttons, restrict right-click. And simple everyday tasks — re-running the
current search in DuckDuckGo, making a QR code for the page, finding an old copy in the Web
Archive — normally mean hopping between sites or keeping extra extensions around.

These bookmarklets solve that kind of daily hassle with a single click from the bookmarks toolbar.

## Browser support

The bookmarklets are plain JS, so they should work in any browser that supports
`javascript:` bookmarks. I don't vouch for, and haven't tested, Chromium-based browsers and
their "security policies".

I use Firefox myself, which is why the extra bits — custom toolbar icons and a tidy
`userChrome.css` theme — are built for Firefox.

## Usage

Open the [gallery](https://daydve.github.io/ddblm/), enable the bookmarks toolbar
(`Ctrl+Shift+B`) and drag a card (icon + name) onto it. If a bookmarklet needs an API token,
enter it in the field on the card first.

The gallery UI is bilingual: English by default, `?lang=ru` for Russian. It also contains the
ready-made Firefox `userChrome.css` theme.

## Repository layout

The bookmarklets live in `src/*.js` — that's the core of this repo. Each file starts with
meta-comments (name, description, icon):

```js
// @label: Copy element text
// @desc: Позволяет скопировать текст любого элемента по клику
// @desc-en: Copy the text of any element on click
// @icon: copy_element_text.svg
```

Icons are in `icons/`, scaffolding templates in `templates/`.

### Bookmarklets

| File | Label | What it does |
|---|---|---|
| `copy.js` | Copy element text | Copy the text of any element on click |
| `ddg.js` | Search on DuckDuckGo | Re-run the current search in DuckDuckGo |
| `edit.js` | Edit mode | Toggle `designMode` to edit text on the page |
| `kpfinder.js` | KPFinder | Search the Kinopoisk database for movies (API token required) |
| `logins.js` | Search logins/passwords | Look up logins for the site on BugMeNot and Google |
| `passwords.js` | Show passwords | Reveal passwords hidden behind asterisks |
| `qr.js` | QR | Generate a QR code for the current page |
| `safeselect.js` | Safe select | Disable links so text can be selected |
| `telegram.js` | Send to Telegram | Send the link or selected text to Telegram |
| `undisable.js` | unDisable element | Force-enable disabled elements |
| `unlock.js` | unlock right click | Remove selection and right-click restrictions |
| `wback.js` | WBack Machine | Wayback Machine menu: archival, last saved, save now |

## The `blm` helper

`blm` is not the point of this repo — it's my tool for working on the bookmarklets. It minifies
JS into `javascript:` URLs (handles template literals, regex, and escapes `#` for URL safety),
builds the gallery and the Firefox theme, and helps scaffold and edit bookmarklets.

Requirements: Python 3.8+.

```bash
./blm config set ff_profile ~/.mozilla/firefox/xxxx.default-release
./blm build           # src/*.js → docs/index.html + docs/blm_panel.css
./blm patchff         # link icons and CSS into the Firefox profile
```

### Commands

```text
build        Build index.html + blm_panel.css from src/
list         List bookmarklets (file, label, icon)
add <name>   Create a new bookmarklet from the template
edit <name>  Open a bookmarklet in your editor
rm <name>    Delete a bookmarklet
config       Config: print / set / get / reset
patchff      Patch the Firefox profile (symlinks + userChrome.css)
get          git pull
put [-m MSG] build + git add + commit + push
```

### Config

Stored in `~/.config/blm/config.json`:

| Key | Description |
|---|---|
| `ff_profile` | Path to the Firefox profile |
| `editor` | Editor used by `blm edit` (default `$EDITOR` or `nano`) |
| `author` | Author name for new bookmarklets |

There are also two standalone utilities outside the CLI: `patch_icon.py` (adapts SVG icons
for Firefox light/dark theme) and `firefox_rdp_proxy.py` (a Firefox Remote Debugging
Protocol proxy).

## License

[MIT](LICENSE) © DayDve.