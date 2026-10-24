# Maintaining This Package

This file records package-specific maintainer facts that are safe to keep in the public repository.

## Purpose

Tagify for Livewire components. The package is the `tagify` integration of `pharaonic/livewire-assistant`: the Assistant finds `data-pharaonic="tagify"` elements, resolves their component, and runs the lifecycle; this package creates the Tagify field, binds it to `wire:model` or `data-property` in both directions, and rebuilds it after Livewire morphs it.

## Supported lines

One line per Livewire major, each on the Assistant line of the same major. `develop` follows the newest line.

| Line | Livewire | Livewire Assistant | Laravel | PHP |
| --- | --- | --- | --- | --- |
| 1.x | `>=1.3.0 <1.3.7 \|\| >=1.3.8 <2.0` | `^1.0` | `^7.30 \|\| ^8.75` | `>=7.4 <8.0` |

Versions are `N.minor.patch`, where `N` is the Livewire major. Releases 1.0.0 to 1.2.1 predate this scheme and were built for Livewire 2; the 1.x line continues at 1.3.0 for Livewire 1.

## Core library

`pharaonic/livewire-assistant`. Everything about discovery, component resolution, the bridge, cleanup, and diagnostics belongs there; fix it there, not here.

## Public API invariants

- Blade directive `@livewireTagifyScripts` and its `nonce` option.
- Route `GET /pharaonic/livewire-tagify/tagify.js`, named `pharaonic.livewire-tagify.script`.
- The `tagify` integration name, `data-property`, and the `wire:model` modifiers each line documents.
- The bound value per mode: tag objects, or each tag's `data-key` (default `value`) with `data-direct`; one of those or `null` in `select` mode; the mixed text in `mix` mode, without Tagify's trailing line break.
- The shorthand attributes `data-suggest-list`, `data-black-list`, `data-suggest`, `data-suggest-enforce`, `data-max`, `data-classname`, `data-value`, `data-key`, `data-direct`, and `data-delimiters` (switches are on when present, off with `"false"`), plus `data-options`, which is merged over them key by key.
- The dropdown defaults of releases 1.0 to 1.2: `maxItems` 25, `enabled` 1, `closeOnSelect` false, and `mapValueTo` and `searchKeys` following `data-value`.
- A field with `wire:model`, `data-property`, or `wire:change` never lets Tagify's own `change` event through; a field with `wire:change` gets a native `change` event after its value is written.
- `window.Pharaonic.tagify` and the error code `tagify-missing`.
- Deprecated, kept for the whole line: `<x-pharaonic-tagify::scripts />`, the `livewire-tagify` publish tag, `Pharaonic.Tagify.init()`/`.load(target, componentId)`, and the `pharaonic.tagify.init`/`pharaonic.tagify.load` events.

## Package-specific constraints

- Only `resources/js/livewire.js` differs between lines: it maps `wire:model` modifiers to live or deferred writes with the line's Livewire semantics. Everything else talks to Livewire through the Assistant bridge, so fixes port between lines unchanged.
- `dist/` is committed so Composer users need no Node build. Run `npm run build` after any change under `resources/js/` and commit the result; CI fails when `dist/` is out of date.
- Tagify dispatches a native `change` on the original field with its value as text, and checks that field every 600ms, reloading its tags when something else changed it. Livewire must therefore never see Tagify's event or write the field; values are loaded through `loadOriginalValues()`, which fires no change event. Tagify also ignores changes for 100ms after a load.
- Tagify reads `data-suggest` as text to suggest while typing, so the shorthand is hidden while Tagify builds the field. Tagify needs a `value` on every tag and whitelist object; tags built from plain server values get their text as `value`.
- 1.x: every genuine Livewire 1 release requires PHP 7, so the line runs on PHP 7.4. Pint lives in `tools/pint` and runs on PHP 8.1. `livewire/livewire` 1.3.7 contains Livewire 2 code and is excluded. The advisory ignore list adds Livewire 1 (CVE-2024-47823 has no Livewire 1 fix) and `zbateson/mail-mime-parser`.
- The advisory ignore list covers the Laravel framework tree of the line, which no longer receives security fixes, following the Laravel DNA.

## Verification

```bash
php7.4 composer check
php8.1 tools/pint/vendor/bin/pint --test
npm ci
npm run check            # lint, unit tests, dist check, browser tests
```

Browser tests start `php -S` on the fixture app in `tests/Browser` with real Livewire components, the real Assistant runtime from `vendor/`, and Tagify from `node_modules/`. They use `php7.4` unless `FIXTURE_PHP` names another PHP 7.4 binary. Set `BROWSERS=chromium,firefox,webkit` to choose browsers. Each open issue the line fixes has a browser test named after it. Run them for every Laravel major with lowest and highest dependencies, for example:

```bash
php7.4 composer update --with laravel/framework:^7.30 --with orchestra/testbench:^5.20 --prefer-lowest
```

## Branch notes

`main` holds the 1.0 to 1.2.1 releases, which were built for Livewire 2, and is not developed further. The 1.x line was started from it for Livewire 1.

## Documentation

https://pharaonic.dev/packages/livewire/tagify

Keep this file factual and package-specific. General Pharaonic engineering policy belongs in the private engineering repository, not here.
