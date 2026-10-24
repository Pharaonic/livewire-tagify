## API Reference

### Markup

| Attribute | Value |
| --- | --- |
| `data-pharaonic` | `tagify` |
| `wire:model` | Property name or dot path; `.defer` waits for the next request; every other form is sent right away |
| `data-property` | Property name or dot path; wins over `wire:model` |
| `data-direct` | Bind each tag's `data-key` instead of tag objects; `"false"` turns it off |
| `data-key` | The tag field `data-direct` binds; `value` when absent |
| `data-suggest-list` | `whitelist`, a JSON array or a delimited list |
| `data-black-list` | `blacklist`, a JSON array or a delimited list |
| `data-suggest` | `dropdown.enabled: 0`; `"false"` turns it off |
| `data-suggest-enforce` | `enforceWhitelist: true` and `dropdown.enabled: 0`; `"false"` turns it off |
| `data-max` | `maxTags`, a positive whole number |
| `data-delimiters` | `delimiters` |
| `data-classname` | `dropdown.classname` |
| `data-value` | `tagTextProp`, `dropdown.mapValueTo`, and `dropdown.searchKeys` |
| `data-options` | JSON object passed to Tagify, merged over the shorthands key by key |
| `wire:change` | Runs after the new value is written |
| `data-component-id` | Component id (`$this->id`); empty or absent means the closest component |

### Bound Values

| Mode | Default | With `data-direct` |
| --- | --- | --- |
| tags | array of tag objects | array of each tag's `data-key` |
| `select` | one tag object or `null` | one `data-key` value or `null` |
| `mix` | text with `[[{...}]]` tags | text with `[[{...}]]` tags |

### Browser API

`window.Pharaonic.tagify` is present once the integration has loaded; it has no methods in this release.

Deprecated aliases, on `window.Pharaonic.Tagify`:

| Method | Description |
| --- | --- |
| `init()` | Calls `Pharaonic.assistant.scan(document)` |
| `load(target, componentId)` | Calls `Pharaonic.assistant.scan(target)`; `target` is an element or a selector, and `componentId` sets `data-component-id` when the element has none |

### Events

| Event | Direction | Purpose |
| --- | --- | --- |
| `change` | dispatched on a field with `wire:change` | After the new value is written |
| `pharaonic:assistant:error` | dispatched on `window` | Failures while mounting, updating, or cleaning up (see the Livewire Assistant diagnostics) |
| `pharaonic.tagify.init` | listened on `window` | Deprecated: scans the document |
| `pharaonic.tagify.load` | listened on `window` | Deprecated: scans `event.detail.target` with `event.detail.component` as the component id |

### Error Codes

| Code | Raised when | Channel |
| --- | --- | --- |
| `tagify-missing` | Tagify is not on `window.Tagify` once the page has loaded | cause of `mount-failed` |

### Laravel

| Name | Purpose |
| --- | --- |
| `@livewireTagifyScripts` / `@livewireTagifyScripts(['nonce' => $nonce])` | Renders the Assistant runtime and the integration once per page |
| `pharaonic.livewire-tagify.script` | Route name of `GET /pharaonic/livewire-tagify/tagify.js` |
| `Pharaonic\Livewire\Tagify\TagifyServiceProvider` | Auto-discovered service provider |
| `<x-pharaonic-tagify::scripts />` | Deprecated: renders `@livewireTagifyScripts` |
| `livewire-tagify` publish tag | Deprecated: copies the script to `public/vendor/pharaonic/pharaonic.tagify.min.js` |
