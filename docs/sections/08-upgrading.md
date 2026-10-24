## Upgrading from 1.2

Releases 1.0 to 1.2.1 supported Livewire 2. Their successor is this 2.x line. Your markup keeps working, attributes included.

### Install 2.x

A `^1.2` constraint never moves to 2.x, so require the new line:

```bash title="Terminal" no-line-numbers
composer require pharaonic/livewire-tagify:^2.0
```

The requirements are higher than 1.2's:

| | 1.2 | 2.x |
| --- | --- | --- |
| PHP | 7.2+ | 8.0 to 8.3 |
| Livewire | 2.0+ | 2.12.7+ |
| Laravel | through Livewire | 7.30+, 8.75+, 9, 10 |

Composer also installs `pharaonic/livewire-assistant`.

### Scripts

Use the directive in new code:

```blade title="resources/views/layouts/app.blade.php"
{{-- 1.2 --}}
<x-pharaonic-tagify::scripts />

{{-- 2.x --}}
@livewireTagifyScripts
```

`<x-pharaonic-tagify::scripts />` renders exactly the same tags, so you can switch whenever you like.

If you published `vendor/pharaonic/pharaonic.tagify.min.js` and load it with your own `<script>` tag, switch to the directive now: the file needs the Livewire Assistant runtime, which the directive loads. Then delete the published file.

:::info Deprecated, not removed
The scripts component, the publish tag, and the old JavaScript functions still work on every 2.x release. New code should use their replacements. They will be removed no earlier than a future major line.
:::

### Attributes

| 1.2 | 2.x |
| --- | --- |
| `data-component-id="{{ $this->id }}"` | Optional: the closest component is used |
| `wire:model`, `wire:model.defer` | Unchanged; `.lazy` and `.debounce` are bound too |
| `data-direct`, `data-key`, `data-value` | Unchanged |
| `data-suggest-list`, `data-black-list` | Unchanged; a delimited list works too |
| `data-suggest`, `data-suggest-enforce`, `data-max`, `data-classname` | Unchanged; `"false"` now turns a switch off |

New: `data-property` to bind without `wire:model`, `data-delimiters`, and `data-options` for any other Tagify setting. See [Options](#options).

### Behaviour Changes

- Server-side changes to the property now show in the field.
- The field shows the property's value when it mounts. On a bound field, its own `value` attribute is ignored; 1.2 read its tags from it.
- Fields without `data-component-id` now mount; 1.2 skipped them.
- Fields that Livewire adds later mount by themselves; you no longer need to dispatch `pharaonic.tagify.init`.
- Tagify's `select` and `mix` modes bind one value and the mixed text. See [Select and Mix Modes](#modes).
- Tagify's own `change` event no longer reaches Livewire or your listeners on a bound field, so a field sends one request per change. `wire:change` on the field now runs, after the value is written.
- Tagify is read from `window.Tagify` when a field mounts, not when the script loads.

### JavaScript

`Pharaonic.Tagify.init()`, `Pharaonic.Tagify.load(target, componentId)`, and the `pharaonic.tagify.init` and `pharaonic.tagify.load` events still work: they call `Pharaonic.assistant.scan()`. In new code, call that directly for fields you add yourself.
