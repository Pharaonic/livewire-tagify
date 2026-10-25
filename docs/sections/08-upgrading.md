## Upgrading from 3.x

The 3.x line supports Livewire 3. When your application moves to Livewire 4, move this package to the 4.x line. The attributes, the directive, the value shapes, and the JavaScript API are unchanged; what changes is what Livewire 4 changes.

Coming from 2.x or 1.2? Follow the upgrade guides of the 3.x and 2.x docs first.

### Install 4.x

A `^3.0` constraint never moves to 4.x, so require the new line:

```bash title="Terminal" no-line-numbers
composer require pharaonic/livewire-tagify:^4.0
```

| | 3.x | 4.x |
| --- | --- | --- |
| PHP | 8.1 to 8.5 | 8.1 to 8.5 |
| Livewire | 3.8.3+ | 4.3.4+ |
| Laravel | 10.15+, 11, 12, 13 | 10.16+, 11, 12, 13 |
| Livewire Assistant | 3.x | 4.x |

### wire:model

A plain `wire:model`, `.live`, and `.lazy` work as on 3.x. Livewire 4 changes `.blur` and `.change`: on their own they only time the update in the browser, so the tags reach the component with its next request. Put them after `.live` to send right away:

| 3.x | 4.x |
| --- | --- |
| `wire:model.blur` | `wire:model.live.blur` |
| `wire:model.change` | `wire:model.live.change` |

:::info .blur and .change alone are deferred
On 3.x, `wire:model.blur` and `wire:model.change` sent the tags right away. On 4.x, without `.live`, they wait for the component's next request like a plain `wire:model`.
:::

`data-property` still sends right away.

### Deprecated, still working

`<x-pharaonic-tagify::scripts />`, the `livewire-tagify` publish tag, `Pharaonic.Tagify.init()`, `Pharaonic.Tagify.load(target, componentId)`, and the `pharaonic.tagify.init` and `pharaonic.tagify.load` events keep working on every 4.x release. New code should use `@livewireTagifyScripts` and `Pharaonic.assistant.scan(element)`.
