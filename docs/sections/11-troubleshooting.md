## Troubleshooting

### A validation message does not show

The `@error` is inside the `wire:ignore` block, which Livewire never updates. Move it outside, next to the block. See [Basic Usage](#basic-usage).

### Nothing happens and there is no field

Check the console. `tagify-missing` means Tagify is not on `window.Tagify`: load it, or with a bundler set `window.Tagify` (see [Installation](#installation)). Make sure `@livewireTagifyScripts` is on the page.

### The property holds objects, but I want strings

Add `data-direct`. Without it the property holds Tagify's tag objects. See [Binding](#binding).

### Picking a suggestion does nothing

Tagify needs a `value` field on every suggestion object. Add one, and use `data-value` to show another field, such as `name`.

### A plain value from the server shows as a number or an id

The value has no matching suggestion. Check that `data-key` names the field the values match, and that the suggestion list holds them.

### New suggestions from the server do not appear

Inside `wire:ignore`, Livewire never changes the field. Give the ignored block a `wire:key` that changes with the data. See [Dynamic Fields](#dynamic-fields).

### The field resets or its dropdown closes after a request

The field is outside `wire:ignore` and the package rebuilds it after each update, or Livewire replaced the block. Wrap the field in `wire:ignore`.

### My change listener no longer runs

On a bound field, Tagify's own `change` event is kept from Livewire and from your listeners, because it carries the value as text. Use `wire:change`, the component's `updated` hook, or Tagify's events through `element.__tagify.on('change', ...)`.

### A field in a nested component updates the parent

Remove a `data-component-id` that names the parent, or leave the attribute out: the closest component is used.

### Composer refuses to install Livewire 1 or Laravel 7 or 8

Those releases have unfixed security advisories. See the warning in [Installation](#installation).
