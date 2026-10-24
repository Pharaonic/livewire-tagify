# Maintaining This Package

This file records package-specific maintainer facts that are safe to keep in the public repository.

## Purpose

Tagify for Livewire components. The package is the `tagify` integration of `pharaonic/livewire-assistant`: the Assistant finds `data-pharaonic="tagify"` elements, resolves their component, and runs the lifecycle; this package creates the Tagify field, binds it to `wire:model` or `data-property` in both directions, and rebuilds it after Livewire morphs it.

## Supported lines

One line per Livewire major, each on the Assistant line of the same major. `develop` follows the newest line.

| Line | Livewire | Livewire Assistant | Laravel | PHP |
| --- | --- | --- | --- | --- |
| 1.x | `>=1.3.0 <1.3.7 \|\| >=1.3.8 <2.0` | `^1.0` | `^7.30 \|\| ^8.75` | `>=7.4 <8.0` |
| 2.x | `^2.12.7` | `^2.0` | `^7.30 \|\| ^8.75 \|\| ^9.0 \|\| ^10.0` | `>=8.0 <8.4` |
| 3.x | `^3.8.3` | `^3.0` | `^10.15 \|\| ^11.0 \|\| ^12.0 \|\| ^13.0` | `>=8.1 <8.6` |

Versions are `N.minor.patch`, where `N` is the Livewire major. Releases 1.0.0 to 1.2.1 predate this scheme and were built for Livewire 2; the 1.x line continues at 1.3.0 for Livewire 1, 2.x is their successor, and 3.x follows Livewire 3.

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
- Livewire writes the model value as text into `wire:model` fields, inside `wire:ignore` too: Livewire 1 and 2 after a response that changed a property, Livewire 3 through Alpine's `x-model` whenever the property changes. Each line's `livewire.js` puts Tagify's own value (`tagifyValue`) back before Tagify's next check would reload the tags from that text: 1.x and 2.x hook `interceptWireModelSetValue`, 3.x wraps the field's `_x_forceModelUpdate`, whether Alpine sets it before or after Tagify mounts.
- The response to a write reports the value it carried, which is older than the field when the user kept typing. A field remembers the values it sent and does not show one of them when Livewire reports it back; any other value from the server is shown.
- 1.x: every genuine Livewire 1 release requires PHP 7, so the line runs on PHP 7.4. Pint lives in `tools/pint` and runs on PHP 8.1. `livewire/livewire` 1.3.7 contains Livewire 2 code and is excluded. The advisory ignore list adds Livewire 1 (CVE-2024-47823 has no Livewire 1 fix) and `zbateson/mail-mime-parser`.
- 2.x: Livewire 2 supports Laravel 7 to 10, so one line covers four Laravel majors, each on the PHP minors it supports (8.0 to 8.3). `^2.12.7` keeps every Livewire release with CVE-2024-47823 out. `.defer` writes are deferred through the bridge; they settle only with the next request, so `wire:change` is fired right away instead of after the write. `composer check`, including Pint, runs on PHP 8.0 with the highest dependencies, which resolve Laravel 9.
- 3.x: Livewire 3 supports Laravel 10 to 13 on PHP 8.1 to 8.5. The Laravel 10 floor is 10.15, the first release with `Stringable::isUrl()`, which Livewire 3.8.3 calls when it renders its scripts. `^3.8.3` keeps every Livewire release with a known advisory out. A plain `wire:model` is deferred; `.live`, `.lazy`, `.change`, and `.blur` write right away, since a Tagify change is the change and blur those wait for. Navigation is `wire:navigate`, so the script tags carry `data-navigate-once`. `composer check` runs on PHP 8.1 with the highest dependencies, which resolve Laravel 10. Fixtures read the component id with `$this->getId()`.
- The advisory ignore list covers the Laravel framework tree of the line, which no longer receives security fixes, following the Laravel DNA.

## Verification

```bash
php8.1 composer check     # 3.x
php8.0 composer check     # 2.x
php7.4 composer check     # 1.x, then: php8.1 tools/pint/vendor/bin/pint --test
npm ci
npm run check            # lint, unit tests, dist check, browser tests
```

Browser tests start `php -S` on the fixture app in `tests/Browser` with real Livewire components, the real Assistant runtime from `vendor/`, and Tagify from `node_modules/`. They use the lowest PHP of the line (`php7.4` on 1.x, `php8.0` on 2.x, `php8.1` on 3.x) unless `FIXTURE_PHP` names another PHP of the line. Set `BROWSERS=chromium,firefox,webkit` to choose browsers. Each open issue the line fixes has a browser test named after it. Run them for every Laravel major with lowest and highest dependencies, for example:

```bash
php7.4 composer update --with laravel/framework:^7.30 --with orchestra/testbench:^5.20 --prefer-lowest
```

## Branch notes

`main` holds the 1.0 to 1.2.1 releases, which were built for Livewire 2, and is not developed further. The 1.x line was started from it for Livewire 1, 2.x from 1.x for Livewire 2, and 3.x from 2.x for Livewire 3. `develop` follows the newest line.

## Documentation

https://pharaonic.dev/packages/livewire/tagify

Keep this file factual and package-specific. General Pharaonic engineering policy belongs in the private engineering repository, not here.
