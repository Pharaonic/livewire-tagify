:::badges
- Livewire Package {color=blue}
- {release.label} {color=green}
- {package.license} License {color=purple}
:::

# Livewire Tagify

Livewire Tagify turns an `<input>` or `<textarea>` in a Livewire component into a Tagify field that stays in sync with the component. Put `data-pharaonic="tagify"` and `wire:model` on the field, load one Blade directive, and the tags follow the property in both directions: what the user adds or removes reaches the component, and what the server sets shows in the field. It is built on Livewire Assistant, which finds the elements, binds each one to the component that owns it, and cleans them up when Livewire removes them.

:::features
### Two-way binding {icon="switch"}
Tag changes update the property, and values the server sets update the field, without echo requests.

### Plain values or tag objects {icon="tag"}
Bind plain values such as php and laravel with data-direct, or keep Tagify's tag objects.

### Tags, select, and mix modes {icon="menu"}
Many tags, one choice from a list, or text with mentions, each with its own bound value.

### Suggestions in one attribute {icon="search"}
Suggestion and block lists, an enforced list, a maximum, and delimiters as plain attributes.

### Right component, always {icon="users"}
Each field binds to the component around it, so nested components and many fields per page just work.

### No Node build required {icon="package"}
The script ships prebuilt in the Composer package, or as an ES module for bundlers such as Vite.
:::

:::info Livewire 1 line
This documentation covers the 1.x line, which supports Livewire 1. Each Livewire major gets its own line.
:::
