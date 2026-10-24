## Upgrading from 2.x

The 2.x line supports Livewire 2. When your application moves to Livewire 3, move this package to the 3.x line. The attributes, the directive, the value shapes, and the JavaScript API are unchanged; what changes is what Livewire 3 changes.

Coming from 1.2? Follow the upgrade guide of the 2.x docs first.

### Install 3.x

A `^2.0` constraint never moves to 3.x, so require the new line:

```bash title="Terminal" no-line-numbers
composer require pharaonic/livewire-tagify:^3.0
```

| | 2.x | 3.x |
| --- | --- | --- |
| PHP | 8.0 to 8.3 | 8.1 to 8.5 |
| Livewire | 2.12.7+ | 3.8.3+ |
| Laravel | 7.30+, 8.75+, 9, 10 | 10.15+, 11, 12, 13 |
| Livewire Assistant | 2.x | 3.x |

### wire:model

Livewire 3 defers a plain `wire:model`, and so does this package: the tags reach the component with its next request.

| 2.x | 3.x |
| --- | --- |
| `wire:model` | `wire:model.live` |
| `wire:model.defer` | `wire:model` |
| `wire:model.lazy` | Unchanged: sent right away |
| `wire:model.debounce.500ms` | `wire:model.live.debounce.500ms` |

`wire:model.change` and `wire:model.blur` are sent right away too. `data-property` still sends right away.

### Attributes

`data-component-id` takes the id from `$this->getId()`; `$this->id` no longer exists in Livewire 3. You can also leave the attribute out: the closest component is used.

### Navigation

Turbolinks and Turbo are replaced by `wire:navigate`. Fields are cleaned up before Livewire leaves a page and mounted again on the next one. The scripts carry `data-navigate-once="true"` instead of `data-turbo-eval` and `data-turbolinks-eval`.

### Deprecated, still working

`<x-pharaonic-tagify::scripts />`, the `livewire-tagify` publish tag, `Pharaonic.Tagify.init()`, `Pharaonic.Tagify.load(target, componentId)`, and the `pharaonic.tagify.init` and `pharaonic.tagify.load` events keep working on every 3.x release. New code should use `@livewireTagifyScripts` and `Pharaonic.assistant.scan(element)`.
