## Purpose
Short, actionable instructions for AI coding agents working on this repository (a small static web app for a car workshop).

## Big picture (what this repo is)
- A static single-page web app (no build system). The main entry is `index.html` which loads `css/style.css` and `js/script.js`.
- Static assets live in `assets/` (images like `assets/logo.png`).
- Data persistence is via browser localStorage — there are no server APIs.

## Key files to read first
- `index.html` — top-level structure and the menu that toggles sections (uses inline `onclick` handlers).
- `css/style.css` — site variables and layout conventions (color variables in :root, `main` centered card layout).
- `js/script.js` — application logic: navigation, clients and vehicles management, localStorage usage. This file contains duplicated blocks and several inconsistent identifiers (see "Patterns & gotchas").

## Patterns & discoverable gotchas (explicit, concrete)
- localStorage keys are used inconsistently: you will see both `clientes`/`vehiculos` and `taller_clientes`/`taller_vehiculos`. Prefer the simpler keys (`clientes`, `vehiculos`) unless making a deliberate change — update all usages if you change the key.
- DOM id/name mismatches: `index.html` uses `id="formClientes"` and `id="formVehiculo"` but `js/script.js` references `#formCliente`, `#formvehiculo`, `#clientevehiculos`, etc. Expect to fix selectors or HTML to match.
- Event wiring: navigation links have inline `onclick="mostrarSeccion('...')"` but the script also attaches click listeners to `nav a` and computes destinations from link text. When changing nav labels prefer using explicit `data-*` attributes or IDs to avoid brittle text-based routing.
- Multiple implementations overlap in `js/script.js` (there are two client sections and multiple vehicle sections). Read the file top-to-bottom; refactor by consolidating a single, consistent model (one source of truth for clients and vehicles) before adding features.
- UI pattern: sections are shown/hidden via `.active` class on `main section`. Use `mostrarSeccion(id)` consistent with the section `id` values.

## Typical dev workflows (concrete commands)
- No build step. To preview the app locally launch a simple static server. In PowerShell you can run:

```powershell
# Python (works if Python is installed)
python -m http.server 8000

# Or with Node (if you have npm):
npx http-server . -p 8080
```

Open http://localhost:8000 (or 8080) in a browser. Use DevTools (Application > Local Storage) to inspect stored `clientes`/`vehiculos`.

## What to change / how to contribute (practical guidance for an AI agent)
- When modifying data keys, update both HTML and all occurrences in `js/script.js` (search for `clientes`, `vehiculos`, `taller_clientes`, `taller_vehiculos`).
- Prefer non-inline event handlers: replace inline `onclick` in `index.html` with `data-action` or `id` and attach listeners in `js/script.js`.
- Consolidate duplicate functions in `js/script.js`: keep a single, well-named set of functions for CRUD operations (e.g., `guardarCliente`, `mostrarClientes`, `eliminarCliente`) and a single localStorage key.
- Keep CSS variables in `css/style.css` (they are used across the app). When adding colors follow the existing `--azul`/`--azul-oscuro` naming.

## Tests, linting, and CI
- This repo currently has no tests or CI config. If adding tests, prefer lightweight JS unit tests (Jest) for data transformation functions and browser integration tests (Playwright) for flows that require UI.

## Merge strategy for existing instructions
- If a `.github/copilot-instructions.md` already exists, preserve any localized or workflow-specific notes and merge these repository-specific items under a "Repository specifics" heading.

## When in doubt
- Run the app in a browser, open DevTools, and inspect Local Storage keys and DOM ids referenced by failing selectors. Most bugs arise from id/selector mismatches and inconsistent key names in `js/script.js`.

---
If you'd like, I can (a) fix the selector/key inconsistencies in `js/script.js` and align the HTML ids, or (b) create a small checklist PR that consolidates the client/vehicle logic. Which would you prefer? 
