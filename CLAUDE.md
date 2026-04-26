# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

The project uses a Nix flake for building and a Nushell module (`mod.nu`) for common tasks. Enter the dev shell with `nix develop` (which drops into `nu`), then use:

```nu
use mod.nu *

rebuild        # nix build + docker compose restart (deploy after code changes)
start          # docker compose up -d
stop           # docker compose down
nix-build      # build the Nix derivation into ./result/
init_db        # create the CouchDB database (first-time setup only)
```

The app runs at `http://localhost:8080` after `start`. CouchDB admin UI is at `http://localhost:5984/_utils` (admin/password).

There are no automated tests and no lint tooling configured.

## Architecture

This is a **Progressive Web App** with no build step for the JavaScript itself — source files are served as ES modules directly from the browser.

### Build pipeline

`nix build` runs [builder.nu](builder.nu) which copies source files into `./result/var/html/` and generates `sw.js` by rendering [sw.js.tera](sw.js.tera) (a Tera template) with a random UUID version and the list of all project files. The output is served by nginx via Docker Compose.

### Data layer — `repo.js`

`Repo` is a singleton that wraps two PouchDB instances:
- `travel` — main data, syncs bidirectionally with CouchDB at `/api` (proxied by nginx to `travel_manager` database)
- `travel_local` — device-local config/info, never synced

All documents have `_id` (UUID), `type` (`"travel"`, `"stay"`, `"transport"`), and optionally `parent` (UUID of containing trip). `getAllDocs(type, parent)` pages through results in batches of 50.

### Background sync — `worker.js`

A Web Worker initialised on page load. Polls every 5 minutes: reads config, skips if `offline`, calls `repo.sync()`, updates `info.lastSync`, and optionally broadcasts a notification via `BroadcastChannel("notification")`.

### Routing — `components/travel-router.js`

Uses the Navigation API (`navigation.addEventListener("navigate", ...)`) to intercept client-side navigation. Routes are matched in order by regex:

| Path | Page component |
|---|---|
| `/config` | `TravelConfig` |
| `/trip/:tripId/stay/:stayId` | `TravelStay` |
| `/trip/:tripId` | `TravelTrip` |
| `*` | `TravelMain` |

The matched page class is instantiated with regex named groups as constructor params and assigned to a manual slot in the router's shadow DOM.

### Pages (`pages/`)

- **`travel-main.js`** — trip list; add/delete trips
- **`travel-trip.js`** — stays + transports for a trip; filter to future items; open OrganicMaps deep link
- **`travel-stay.js`** — stay detail with attachments
- **`travel-config.js`** — sync settings (offline toggle, auto-sync notification)

### Components (`components/`)

Web Components with Shadow DOM and scoped CSS. Naming convention: `*-view.js` for read-only display, `*-edit.js` for forms. Key shared components:

- `travel-list` — responsive grid that renders a list of objects using per-type view constructors
- `travel-router` — handles all client-side navigation
- `travel-header` — top bar with a named slot for action buttons
- `travel-map-overview` — OpenLayers map showing stay/transport positions
- `travel-confirmation` — modal confirmation dialog
- `travel-notification` — toast driven by `BroadcastChannel`
- `travel-markdown-view` — renders markdown via `marked` (from CDN)

### Domain objects (`objects/`)

Each object file (`trip.js`, `stay.js`, `transport.js`) exports a class with:
- `static meta.properties` — property descriptors used by view/edit components to know field names and types (`string`, `markdown`, `date`, `datetime`, `position`, `attachments`, `select`)
- `static default(parent?)` — returns a new blank document with a UUID `_id`

`objects/utils.js` provides `updateElementsFromObject` (populates shadow DOM elements from a doc using `meta.properties`) and `registerCustomElements` (idempotent `customElements.define`).

## Conventions

- **JavaScript only** — no TypeScript, no transpilation
- **Web Components** for all UI — `attachShadow({ mode: "open", slotAssignment: "manual" })` is the standard pattern for pages; components use automatic slot assignment
- **Scoped CSS** inside each component's shadow root
- **Private class fields** (`#field`) for component state
- **Material Icons** SVGs inlined directly (no icon font loaded)
- **No framework** — vanilla browser APIs throughout; dependencies (PouchDB, OpenLayers, marked) loaded from `cdn.jsdelivr.net` via ESM imports
- CSS custom properties defined on `body` in `index.html`: `--primary`, `--primary-light`, `--primary-dark`, `--secondary-*`, `--tertiary-*`, `--background`
