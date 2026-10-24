## Select and Mix Modes

Tagify has three modes, set with `mode` in `data-options`. Every mode binds the same way; only the value differs.

### Tags

The default. The property holds an array: tag objects, or plain values with `data-direct`. See [Binding](#binding).

### Select

One value from a list, like a searchable select.

```blade
<div wire:ignore>
    <input data-pharaonic="tagify" wire:model="country" data-direct data-value="name"
           data-options='{"mode": "select", "enforceWhitelist": true, "dropdown": {"enabled": 0}, "whitelist": [{"value": "eg", "name": "Egypt"}, {"value": "jo", "name": "Jordan"}]}'>
</div>
```

The property holds the chosen value (`"jo"`) or `null`. Without `data-direct` it holds the tag object (`{"value":"jo","name":"Jordan"}`). The server can set either, or `null` to clear the field. Use `"dropdown": {"enabled": 0}` so the list opens on click.

### Mix

Text with tags inside it, such as mentions. Use a `<textarea>`:

```blade
<div wire:ignore>
    <textarea data-pharaonic="tagify" wire:model="message"
              data-options='{"mode": "mix", "pattern": "@", "whitelist": ["Mona", "Omar"], "dropdown": {"enabled": 1, "position": "text"}}'></textarea>
</div>
```

The property holds the text, with each tag written as JSON between `[[` and `]]`:

```php no-copy
$this->message; // 'Hi [[{"value":"Mona","prefix":"@"}]], see you soon'
```

The server sets the same format, and `null` or `''` empties the field. `data-direct` has no effect in mix mode, because the value is text. Tagify's `mixTagsInterpolator` setting changes the `[[` and `]]` markers. Tagify's `mixMode.integrated`, which has no original field, cannot be bound.

:::tip Reading mentions on the server
Pull the tags out of the text when you save it:

```php
preg_match_all('/\[\[(.+?)\]\]/', $this->message, $matches);
$mentioned = array_map(fn ($json) => json_decode($json, true)['value'], $matches[1]);
```
:::
