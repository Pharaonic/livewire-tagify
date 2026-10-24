# Changelog

All notable changes to this project are documented here.

## 1.3.0 - 2026-10-24

The first release for Livewire 1. Releases 1.0.0 to 1.2.1 were built for Livewire 2, so Composer never installs 1.3.0 in a Livewire 2 application.

### Added

- Built on `pharaonic/livewire-assistant`: fields are found, bound to their Livewire component, and cleaned up automatically, including fields Livewire adds later.
- Two-way binding through `wire:model` or `data-property`: tag changes update the property, and server-side changes update the tags.
- Each field binds to the component around it; `data-component-id` binds to a specific component, and an empty value means the closest one.
- Tagify's `select` and `mix` modes: a select binds one value or `null`, a mix field binds its text with the tags written as `[[{"value":"x"}]]`.
- `@livewireTagifyScripts` Blade directive with an optional CSP nonce, rendering the Assistant runtime and the integration once per page.
- `pharaonic.livewire-tagify.script` route serving the prebuilt script with content-hash cache busting.
- `data-options`: a JSON object passed to Tagify, merged over the shorthands key by key.
- `data-delimiters` for Tagify's `delimiters`, thanks to #8.
- `data-suggest`, `data-suggest-enforce`, and `data-direct` turn off with `"false"`.
- `data-suggest-list` and `data-black-list` also take a delimited list, like Tagify's own `data-whitelist`.
- Plain values from the server show the matching whitelist entry, so `data-direct` with `data-key` shows the entry's text.
- `wire:change` on the field runs after the new value is written.
- Fields outside `wire:ignore` are rebuilt after Livewire updates them.
- Tagify is read from `window.Tagify` when a field mounts; a page without it reports `tagify-missing`.
- ES module build for bundlers such as Vite.

### Fixed

- A bound field sends one request per change, also with the markup of #7, which sent requests without end. Tagify's own `change` event, which carries its value as text, no longer reaches Livewire.

### Deprecated

These aliases keep working on every 1.x release.

- `<x-pharaonic-tagify::scripts />`: use `@livewireTagifyScripts`.
- The `livewire-tagify` publish tag: the script is served by the package route.
- `Pharaonic.Tagify.init()`, `Pharaonic.Tagify.load()`, and the `pharaonic.tagify.init` and `pharaonic.tagify.load` events: call `Pharaonic.assistant.scan(element)` for fields you add outside a Livewire update.

### Compatibility

- Livewire 1.3.0 to 1.3.9, except 1.3.7, which contains Livewire 2 code.
- Laravel 7.30+ and 8.75+.
- PHP 7.4, because every Livewire 1 release requires PHP 7.
- Tagify 4 remains your application's dependency; the suite runs on 4.39.0.
- Livewire 1, Laravel 7, and Laravel 8 no longer receive security fixes.
