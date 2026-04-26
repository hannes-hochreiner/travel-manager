# UX Design Document — Travel Manager

## Color System

### Palette

The palette is defined as CSS custom properties on `body` in `index.html`. Every component inherits them via the Shadow DOM boundary (custom properties pierce shadow roots).

All three hues share the same saturation (60%) and the same lightness steps (20% / 50% / 80%), making the palette visually cohesive across types.

| Role | Variable | Value | Description |
|---|---|---|---|
| Primary | `--primary` | `hsl(198, 60%, 50%)` | Teal/cyan — global chrome |
| Primary light | `--primary-light` | `hsl(198, 60%, 80%)` | Tint for backgrounds |
| Primary dark | `--primary-dark` | `hsl(198, 60%, 20%)` | Text and icons on primary |
| Secondary | `--secondary` | `hsl(78, 60%, 50%)` | Yellow-green — trip/stay content |
| Secondary light | `--secondary-light` | `hsl(78, 60%, 80%)` | |
| Secondary dark | `--secondary-dark` | `hsl(78, 60%, 20%)` | |
| Tertiary | `--tertiary` | `hsl(318, 60%, 50%)` | Pink/magenta — destructive/error |
| Tertiary light | `--tertiary-light` | `hsl(318, 60%, 80%)` | |
| Tertiary dark | `--tertiary-dark` | `hsl(318, 60%, 20%)` | |
| Background | `--background` | `hsl(60, 100%, 98%)` | Near-white warm page background |

### Semantic Color Assignment

Color communicates hierarchy and intent, not decoration:

- **Primary (teal)** — the app shell: the global `travel-header` navigation bar, transport cards and their edit dialogs. Signals "application frame" or "transit".
- **Secondary (yellow-green)** — user content: trip cards, stay cards, location cards, breadcrumb bars, the edit dialogs for stays and locations, and info-level notifications.
- **Tertiary (pink/magenta)** — danger and attention: the confirmation dialog, the login dialog, error notifications, and the visual state of items marked for deletion. Nothing uses tertiary in an ambiguous or decorative way.

### Gradient Convention

Every colored header uses a 45° diagonal gradient from the lighter tone to the regular tone:

```css
background: linear-gradient(45deg, var(--color-light), var(--color));
```

The only reversal of this pattern is the clickable breadcrumb links on the stay page, where the hover state swaps light and regular to provide a clear interactive affordance without changing color family.

Notifications reverse the direction (`secondary → secondary-light`) so the gradient "faces" the opposite way from the card headers, creating a subtle visual distinction between static and transient surfaces.

---

## Typography

- **Font**: Noto Sans (variable font loaded from Google Fonts), `font-weight: 400` base, `font-optical-sizing: auto`.
- **Card titles**: `font-size` defaults to heading level (h2), `font-weight: 700`, colored with `--color-dark`.
- **Edit dialog titles**: title input styled to match the header visually — `font-size: 1.5rem`, `font-weight: 700`, same `--color-dark`.
- **Breadcrumb level names**: h2 elements inside `.breadcrumb` divs.
- **App title**: h1 inside `travel-header`, always a link to `/`.
- **Markdown content**: rendered via `marked`, with h1–h3 styled to `--color-dark` in the active color scheme. All links open in `_blank`.

---

## Layout Principles

- The page is a single flex column: global header → breadcrumb bar (on sub-pages) → main content area.
- The content area uses a responsive CSS grid: `repeat(auto-fit, minmax(20rem, 1fr))`. Cards naturally flow to fill available width.
- Cards: `display: flex; flex-direction: column; border: 1px solid`. No border-radius (sharp corners are consistent across all cards).
- Dialogs: no padding on the `<dialog>` element itself; the inner `div.content` provides the card-like border.
- The notification toast uses `border-radius: 15px` as a deliberate exception — its rounded corners distinguish it as a floating, transient element.
- Content inside pages has `margin: 1rem` from the edges.

---

## Card Structure

Every view component (`TripView`, `StayView`, `TransportView`, `LocationView`) follows the same internal structure:

```
┌─────────────────────────────────────────┐
│ header (gradient background)            │
│   Title (link to detail page)  [menu ⋮] │
├─────────────────────────────────────────┤
│ secondary info (dates, positions)       │
├─────────────────────────────────────────┤
│ main (markdown description)             │
│ attachments (if any)                    │
└─────────────────────────────────────────┘
```

- The title in the card header is always an anchor tag navigating to the object's detail page.
- The action menu (`travel-menu`) sits in the top-right corner of the header.
- Transport cards additionally prefix their title with a mode-of-transport icon (via CSS `::before` and a Blob `content: url(...)`) — a train or plane icon matches the `subtype` field.

---

## Action Menu (travel-menu)

The action menu is a custom dropdown used on every card. It is the sole affordance for per-object actions.

**Trigger**: a vertical three-dot icon (Material Icons `more_vert`), styled in `--color-dark`.

**Behavior**:
1. Clicking the button toggles the `.open` class on the wrapper, which shows the `dropdown-content`.
2. The menu closes on `focusout` of the trigger button (unless the mouse has already entered the menu), on `mouseleave` from the menu, or when any item is clicked.
3. The dropdown is positioned `right: 0; top: 1rem` — flush to the right edge of the card header.
4. The button gains a `--color-light` background when the dropdown is open (`.dropdown.open button`), giving persistent visual feedback that the menu is active.

**Item layout**: each `<li>` is a flex row with `gap: 0.5rem` — a 24px SVG icon on the left, a text label on the right. Hover background is `--color-light`.

**Actions available by type**:

| Object | Menu items |
|---|---|
| Trip | edit, delete |
| Stay | open in Organic Maps, edit, delete |
| Transport | edit, delete |
| Location | edit, open in Organic Maps, delete |

The `style` attribute on `<travel-menu>` controls which color family the menu uses (`primary` by default, overridden to `secondary` on secondary-colored cards).

---

## Modal Dialogs for Editing

All create and edit operations use the native `<dialog>` element opened with `showModal()`, which provides a backdrop and focus trapping.

**Layout** (identical across all edit dialogs):

```
┌────────────────────────────────────┐
│ header (--color-light background)  │
│   <input id="title" />             │
├────────────────────────────────────┤
│ main                               │
│   form fields specific to type     │
├────────────────────────────────────┤
│ footer                             │
│  [✓ save] [✕ cancel]              │
│  (each button: flex-grow: 1)       │
└────────────────────────────────────┘
```

- The title `<input>` in the header is styled to visually match the header background (`--secondary-light` or `--primary-light`), making it feel like an editable title, not a form field.
- Footer buttons are **icon-only** (no labels), each spanning half the dialog width (`flex-grow: 1`):
  - Save: checkmark SVG
  - Cancel: X SVG
- Dialog width is `calc(100% - 1rem)` on mobile-first forms (Stay, Transport, Location) to use full screen width.

**Specific dialog contents**:

| Dialog | Fields |
|---|---|
| TripEdit | title input, description textarea (markdown) |
| StayEdit | title input, start date, end date, description textarea, position picker |
| TransportEdit | title input, subtype select (Train/Plane), start datetime + start position, description textarea, attachments, end datetime + end position |
| LocationEdit | title input, subtype select (Accommodation/Sight/Museum/Nature/Temple/Transport/Information), description textarea, position picker, attachments |

**TransportEdit** is the only dialog that returns a Promise resolved with `{ action: "update" | "cancel" }`, enabling the caller to react to the outcome. All other edit dialogs call a callback passed at `edit_object(obj, cb)` time.

---

## Confirmation Dialog

`travel-confirmation` follows the same dialog structure as edit dialogs but uses the **tertiary** (pink) color for its header gradient. This unambiguously signals a destructive, irreversible action.

- Title and message are injected via named slots so the host page can template in the object's name (using `<span class="confirm_title">` populated before triggering).
- The `confirm` setter both assigns the callback and immediately calls `showModal()`, so triggering deletion is a single assignment in the caller.
- Save = execute the action; Cancel = dismiss with no change.

---

## Position Picker (travel-position-edit)

A dual-tab widget used inside stay, transport, and location edit dialogs.

**Tab 1 — Numerical Input** (default active):
- Longitude and latitude number inputs (`step: 0.000001`).
- **Swap button**: swaps longitude and latitude values. Used when coordinates are copied from a source that uses lat,lng order instead of lng,lat.
- **Clipboard paste button**: reads the clipboard and parses either a `geo:lat,lng` URI or a plain `lat,lng` string, filling both fields and updating the map.

**Tab 2 — Map Selection**:
- An OpenLayers map with an OSM tile layer.
- A single click on the map moves the pin and updates the numerical inputs in Tab 1.
- The pin icon is a crosshair/target SVG rendered as a Blob URL (always in `--primary-dark` color `#143f52`).

Both tabs are kept in sync — a change in either one immediately updates the other. The map `View.setCenter()` is called on every numeric change to keep the pin visible.

---

## Map Overview (travel-map-overview)

A read-only OpenLayers map displayed at the top of the trip and stay list views, 350px tall.

- **Stays and locations** appear as point markers. Each location subtype has a dedicated icon (accommodation = bed, museum, temple, nature, sight, transport, information). Unknown subtypes use a generic map pin.
- **Transports** appear as directional lines: a 2px stroke in `--primary-dark` (#143f52) with an arrowhead at the destination end. The arrowhead is a filled triangle rotated to match the bearing of the line.
- **Labels**: each stay/location gets a floating `Overlay` with a semi-transparent white rounded background showing the title. Labels are hidden while the pointer is over the map (to reduce clutter during interaction) and shown again on `mouseout`.
- The map auto-fits its view to include all features, with 100px padding on each side and a `maxZoom` of 15.

---

## Notifications (travel-notification)

A toast component driven by `BroadcastChannel("notification")` — used by both the sync worker and the config page.

- **Position**: fixed, centered horizontally at the bottom of the viewport (`left: 50%; transform: translateX(-50%)`).
- **Show/hide**: CSS transform transition — hidden state slides the element down 150% (`translateY(150%)`); visible state resets to center. Duration: 0.5s ease-in-out.
- **Types**:
  - `info`: secondary color. Auto-dismisses after 2 seconds.
  - `error`: tertiary color. Stays until the user clicks the close (X) button.
- Notifications queue. If a new one arrives while one is showing, it waits. Closing (manually or via timeout) advances the queue.
- The header contains the title and a close button; the body contains the message.

---

## Page-Level Actions (Header Buttons)

Each page places action buttons in the `travel-header` via the `actions` named slot. Buttons in the header are **icon-only compound buttons** — they combine a `+` (add) icon with a content-type icon to form a single click target.

| Page | Button | Icons | Action |
|---|---|---|---|
| Main (trip list) | Add trip | `+` + trip-search icon | Opens TripEdit dialog |
| Main | Settings | gear icon | Navigates to `/config` |
| Trip | Add stay | `+` + building icon | Opens StayEdit dialog |
| Trip | Add transport | `+` + transport icon | Opens TransportEdit dialog |
| Stay | Add location | `+` + map-pin icon | Opens LocationEdit dialog |

---

## Page-Level Filters and Toggle Buttons

Toggle buttons on list pages use a `selected` CSS class to show active state. The active state applies `background-color: var(--secondary-light)` and may change SVG fill to `--secondary-dark`.

| Page | Button | When active |
|---|---|---|
| Trip | Filter future | Hides items whose end date is before today |
| Stay | Filter by type | Hides accommodation, transport, and information items (shows only sights, museums, nature, temples) |

---

## External App Integration

Several actions open deep links into mapping apps rather than navigating within the app:

- **OrganicMaps single location**: `om://map?v=1&ll=<lat>,<lng>&n=<title>` — opens a pin on the map.
- **OrganicMaps all stays in a trip**: builds a multi-point URL with all stays' coordinates. Triggered from the trip breadcrumb bar.
- **OrganicMaps all locations in a stay**: same pattern, triggered from the stay breadcrumb bar.
- **OrganicMaps directions**: `om://route?sll=...&saddr=...&dll=...&daddr=...&type=transit` — opened from the Direction Links dialog.
- **Google Maps directions**: `https://www.google.com/maps/dir/?api=1&origin=...&destination=...&travelmode=transit` — opened from the same Direction Links dialog.

The **Direction Links dialog** (`travel-direction-links`) is the only dialog that uses the tertiary color for its header but is not destructive — it is used to pick origin and destination from dropdowns and open a routing link. This is the one inconsistency in the tertiary semantic: tertiary is used for "needs attention / external action" as much as "destructive".

---

## Attachments

**View** (`travel-attachments-view`): a responsive auto-fill grid (`minmax(9rem, 1fr)`). Each attachment is a `<button>` showing the filename. Clicking opens the file as a Blob URL in a new tab. Hover inverts button colors (background becomes `--color-dark`, text becomes `--color-light`).

**Edit** (`travel-attachments-edit`): a `<fieldset>` with a multi-file input and a list of existing attachments. Each existing attachment has a toggle-delete button. When toggled, the button gains class `deleted` which applies `--tertiary-light` background and `--tertiary-dark` icon fill — a visual strikethrough signal. Items marked deleted are excluded when the parent dialog saves.

---

## Config Page

The config page (`/config`) uses the same responsive grid (`minmax(20rem, 1fr)`) as the trip list to lay out setting panels as `<article>` cards. Each article has a bold header and action buttons that pair an icon with a text label (the only place in the app where buttons consistently show both icon and label text).

**Panels**:
- **Networking Mode**: one toggle button showing the current state (`online`/`offline`) with a wifi/no-wifi icon. Clicking toggles and immediately persists.
- **Synchronization**: last sync timestamp, a bell toggle for auto-sync notifications (shows whether notifications are on/off with icon and label), and a manual sync button.
- **Storage**: quota and usage in MB, persisted status, and a persist button.
- **Login**: the `travel-login` dialog component, rendered inline (currently not wired to trigger itself automatically).
