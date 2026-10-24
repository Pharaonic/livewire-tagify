## Options

There are three ways to configure Tagify, from the simplest:

1. the package's shorthand attributes, for the most common settings;
2. the attributes Tagify reads itself;
3. `data-options`, a JSON object, for everything else.

### Shorthand Attributes

```blade
<input data-pharaonic="tagify" wire:model="groups" data-direct data-suggest-enforce
       data-suggest-list='["Team A","Team B"]' data-max="3">
```

| Attribute | Tagify setting |
| --- | --- |
| `data-suggest-list='[...]'` | `whitelist`: the suggestions |
| `data-black-list='[...]'` | `blacklist`: values that are never added |
| `data-suggest` | `dropdown.enabled: 0`: suggestions open on focus |
| `data-suggest-enforce` | `enforceWhitelist: true` and `dropdown.enabled: 0`: only suggestions can be added |
| `data-max="5"` | `maxTags` |
| `data-delimiters=",\|;"` | `delimiters`: what splits typed or pasted text into tags |
| `data-classname="menu"` | `dropdown.classname`: a class for the suggestion dropdown |
| `data-value="name"` | `tagTextProp`, `dropdown.mapValueTo`, and `dropdown.searchKeys`: the field of a suggestion object that is shown and searched |
| `data-direct` | binds plain values instead of tag objects (see [Binding](#binding)) |
| `data-key="id"` | the field `data-direct` binds; `value` when absent |

`data-suggest`, `data-suggest-enforce`, and `data-direct` are on when present, with or without a value. `"false"` turns them off, which helps when Blade decides: `data-direct="{{ $plain ? 'true' : 'false' }}"`.

`data-suggest-list` and `data-black-list` take a JSON array of strings or objects. Anything that is not a JSON array is read as a list split by the delimiters (`,` unless set): `data-suggest-list="php, laravel"`. `data-max` takes a positive whole number; any other value is ignored.

Suggestion objects need a `value` field, as Tagify requires; add others, such as `name` with `data-value="name"`:

```blade
<input data-pharaonic="tagify" wire:model="country" data-direct data-value="name"
       data-suggest-list='@json([["value" => "eg", "name" => "Egypt"], ["value" => "jo", "name" => "Jordan"]])'>
```

### Defaults

Without attributes, every field gets the dropdown of releases 1.0 to 1.2:

```json no-copy
{
    "tagTextProp": "value",
    "dropdown": { "maxItems": 25, "enabled": 1, "closeOnSelect": false, "classname": "", "mapValueTo": "value", "searchKeys": ["value"] }
}
```

Suggestions show after one typed character, up to 25 at a time, and the dropdown stays open after a pick.

### Tagify's Own Attributes

Tagify reads `placeholder`, `readonly`, `disabled`, and `required` from the field, and `data-whitelist` and `data-blacklist` as lists split by the delimiters. These need no help from the package.

### data-options

Anything else goes in `data-options` as a JSON object:

```blade
<input data-pharaonic="tagify" wire:model="emails" data-options='{"pattern": "^\\S+@\\S+$", "duplicates": false, "editTags": 1}'>
```

Use single quotes around the attribute so the JSON can use double quotes. In Blade you can build it from PHP:

```blade
<input data-pharaonic="tagify" wire:model="labels" data-options='@json(["maxTags" => $limit, "dropdown" => ["maxItems" => 10]])'>
```

Invalid JSON, or JSON that is not an object, is reported as `invalid-options` and the field is not mounted. Settings that are JavaScript functions, such as `transformTag` or `validate`, cannot be set from markup.

### Which Wins

`data-options` is merged over the defaults and the shorthands key by key, also inside nested objects: `{"dropdown": {"maxItems": 5}}` keeps the other dropdown settings, including the ones `data-suggest` and `data-classname` set. Tagify's own `data-whitelist` and `data-blacklist` win over both.

### Changing Options

Inside `wire:ignore`, Livewire never changes the field, so new attributes from the server are not applied. To change settings or the suggestion list, let Livewire replace the block with a new `wire:key`. See [Dynamic Fields](#dynamic-fields).
