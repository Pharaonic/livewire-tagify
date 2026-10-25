## Binding

The package binds a field to one component property, in both directions.

### wire:model or data-property

The property comes from `wire:model` on the field, or from `data-property`. When both are present, `data-property` wins.

```blade
<input data-pharaonic="tagify" wire:model="skills">
<input data-pharaonic="tagify" data-property="filters.tags">
```

Both accept a property name or a dot path (`filters.tags`, `rows.2.labels`).

### Modifiers on Livewire 4

The modifiers mean what they mean in Livewire 4:

| Attribute | The change is sent |
| --- | --- |
| `wire:model` | with the component's next request, such as a `wire:click` |
| `wire:model.live` | right away |
| `wire:model.lazy` | right away: Tagify reports a change once the tags have changed, which is the change this modifier waits for |
| `wire:model.blur`, `wire:model.change` | with the component's next request: without `.live`, Livewire 4 only uses them to time the update in the browser |

Triggers after `.live`, such as `.live.blur` or `.live.debounce.500ms`, send right away too, since a Tagify change is the change and the blur they wait for. `data-property` always sends right away.

### Value Shapes

What the property holds depends on `data-direct` and on Tagify's mode.

| Field | Property after the user adds `php` and `laravel` |
| --- | --- |
| Tags, default | `[{"value":"php"},{"value":"laravel"}]` |
| Tags, `data-direct` | `["php","laravel"]` |
| Tags, `data-direct data-key="id"` | each tag's `id`, such as `[1,2]` |
| `select` mode | one tag object, such as `{"value":"php"}`, or `null` |
| `select` mode with `data-direct` | one value, such as `"php"`, or `null` |
| `mix` mode | the text with its tags, such as `Hi [[{"value":"Mona"}]]` |

Tag objects keep every field Tagify holds for the tag, such as the extra fields of a suggestion object, without Tagify's internal ones. See [Select and Mix Modes](#modes) for those two modes.

### What the Server Can Set

The server can set the property to any of the shapes above, and the field shows it:

| Property value | Tags mode shows | Select mode shows |
| --- | --- | --- |
| `null`, `''`, or `[]` | no tags | nothing |
| `'php'` | one tag `php` | `php` |
| `['php', 'laravel']` | two tags | set one value instead |
| `[['value' => 'php']]` | the tag object as it is | the tag object as it is |
| `[1, 2]` with `data-key="id"` | the suggestions whose `id` is 1 and 2 | set one value instead |

A plain value shows the suggestion it names: the entry of the suggestion list whose `data-key` field (or text) equals it. A value with no matching suggestion becomes a tag that shows the value as text.

### How Values Move

- **Initial value.** When the field mounts, it shows the property's current value. The field's own `value` attribute is ignored for a bound field.
- **User to server.** Adding, removing, or editing a tag sends the new value to the property in a Livewire request.
- **Server to field.** When a Livewire update changes the property, from an action, a lifecycle hook, or another field, the field shows the new value.
- **No echo.** Values the server sets are shown without being sent back, and a change that leaves the value as Livewire holds it sends nothing.

### Reacting to Changes

`wire:change` on the field runs after the new value is written, so the action sees it. With a plain `wire:model`, the deferred value travels in the `wire:change` request:

```blade
<div wire:ignore>
    <input data-pharaonic="tagify" wire:model="skills" data-direct wire:change="skillsChanged">
</div>
```

Tagify fires its own `change` event with its value as text. On a bound field, or one with `wire:change`, that event never reaches Livewire or your listeners; the package fires a plain `change` event once the value is written instead. An `updated` hook in the component needs no event at all:

```php title="app/Http/Livewire/Profile.php"
public function updatedSkills($value)
{
    $this->suggestions = Skill::related($value)->pluck('name');
}
```
