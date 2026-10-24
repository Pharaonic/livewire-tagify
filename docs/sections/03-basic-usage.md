## Basic Usage

A Tagify field is a normal `<input>` with `data-pharaonic="tagify"` and `wire:model`, wrapped in `wire:ignore`.

### The Component

```php title="app/Http/Livewire/Profile.php"
<?php

namespace App\Http\Livewire;

use Livewire\Component;

class Profile extends Component
{
    public $skills = ['php'];

    public $keywords = [];

    public function render()
    {
        return view('livewire.profile');
    }
}
```

### The View

```blade title="resources/views/livewire/profile.blade.php"
<div>
    <div wire:ignore>
        <input data-pharaonic="tagify" wire:model="skills" data-direct data-suggest
               data-suggest-list='["php","laravel","livewire"]'>
    </div>

    <div wire:ignore>
        <input data-pharaonic="tagify" wire:model="keywords" data-max="5">
    </div>
</div>
```

That is all. The first field shows the tag `php`; adding `laravel` sets `$skills` to `["php","laravel"]`; `$this->skills = ['livewire']` on the server shows that tag instead. The second field holds Tagify's tag objects, such as `[{"value":"seo"}]`, and stops at five tags. See [Binding](#binding) for the value shapes.

### Why wire:ignore

Livewire updates a component's HTML after each request to match the server. Tagify hides the field and adds its own markup before it, which that update would remove. `wire:ignore` tells Livewire to leave the block alone, so the field survives every request. The package keeps the value in sync through the component, not through the HTML.

A field can also live outside `wire:ignore`. The package then rebuilds it after each Livewire update. See [Dynamic Fields](#dynamic-fields).

### The Attributes

| Attribute | Purpose |
| --- | --- |
| `data-pharaonic="tagify"` | Marks the element; required |
| `wire:model="property"` | The property to bind, with its modifiers |
| `data-property="property"` | The property to bind, when you do not use `wire:model` |
| `data-direct`, `data-key` | Bind plain values instead of tag objects (see [Binding](#binding)) |
| `data-suggest-list`, `data-suggest`, `data-suggest-enforce`, `data-black-list`, `data-max`, `data-delimiters`, `data-classname`, `data-value` | Shorthands for common Tagify settings (see [Options](#options)) |
| `placeholder`, `readonly`, `disabled`, `required` | Read by Tagify itself |
| `data-options='{...}'` | A JSON object passed to Tagify, for everything else |
| `data-component-id` | Optional: bind to a specific component instead of the one around the field |

Without `wire:model` or `data-property`, the field becomes a Tagify field that is not bound to anything, and Tagify's own `change` event reaches your listeners as usual.

### Labels and Validation Messages

Livewire never updates anything inside `wire:ignore`, including an `@error` message placed there. Keep labels and messages outside the ignored block, so they update with the component:

```blade
<label for="skills">Skills</label>

<div wire:ignore>
    <input id="skills" data-pharaonic="tagify" wire:model="skills" data-direct>
</div>

@error('skills') <span class="text-danger">{{ $message }}</span> @enderror
```
