## Dynamic Fields

Livewire adds, removes, and re-renders elements. The package follows it.

### Fields Livewire Adds or Removes

Fields that appear after a Livewire update, such as a new row from `wire:click="addRow"`, mount and bind after that update. Fields that disappear are cleaned up: their listeners are removed and Tagify is destroyed.

```blade title="resources/views/livewire/products.blade.php"
@foreach ($rows as $index => $row)
    <div wire:key="row-{{ $row['id'] }}">
        <div wire:ignore>
            <input data-pharaonic="tagify" wire:model="rows.{{ $index }}.tags" data-direct>
        </div>
    </div>
@endforeach

<button wire:click="addRow">Add row</button>
```

:::tip Key rows by something stable
Give each row a `wire:key` that stays with the row, such as an id, not its position. When a row in the middle is removed, position keys shift, and Livewire keeps the wrong fields.
:::

### New Suggestions from the Server

Inside `wire:ignore`, Livewire never changes the field, so a new `data-suggest-list` from the server is not applied. Give the ignored block a `wire:key` that changes with the data: Livewire replaces the block, the old field is cleaned up, and the new one mounts with the new list.

```blade
<div wire:ignore wire:key="tags-{{ $category }}">
    <input data-pharaonic="tagify" wire:model="tags" data-direct data-suggest data-suggest-list='@json($suggestions)'>
</div>
```

### Fields Outside wire:ignore

A field outside `wire:ignore` works too. Livewire's update removes the markup Tagify added, and the package rebuilds the field after each update, with the property's current value. Every request that re-renders the component rebuilds the field and closes an open dropdown, so prefer `wire:ignore`.

:::warning Key ignored blocks that come and go
Without keys, Livewire compares siblings by position. When ignored blocks can appear or disappear next to each other, give each a unique `wire:key`.
:::

### Nested Components and Many Fields

Each field binds to the closest Livewire component around it. A field in a nested component writes to that component, never to the parent. Any number of fields can share a page.

`data-component-id` binds a field to a specific component wherever it is. In a Livewire 4 view the id is `$this->getId()`. An empty value means the closest component.

### Fields You Add Yourself

Fields you add with JavaScript, outside a Livewire update, need one call:

```js
Pharaonic.assistant.scan(container)     // mounts the fields in container
Pharaonic.assistant.destroy(container)  // cleans them up
```

### wire:navigate

Fields are cleaned up before `wire:navigate` leaves a page and mounted again on the next one, including back and forward. The scripts carry `data-navigate-once`, so they load once.
