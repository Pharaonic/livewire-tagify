---
view: components.packages.features
variant: compact
badge: Key Features
title: Everything a tag input needs inside Livewire
subtitle: One attribute on the field, one directive in the layout.
items:
  - icon: switch
    title: Two-way binding
    text: Added and removed tags reach the property, and server-side changes reach the field, with no echo requests.
  - icon: tag
    title: Plain values or tag objects
    text: "Bind `[\"php\",\"laravel\"]` with `data-direct`, or keep Tagify's tag objects and their extra fields."
  - icon: menu
    title: Tags, select, and mix modes
    text: Many tags, one choice from a list, or text with mentions, each with its own bound value.
  - icon: search
    title: Suggestions in one attribute
    text: "`data-suggest-list`, `data-suggest-enforce`, `data-black-list`, `data-max`, and `data-delimiters`."
  - icon: users
    title: Right component, always
    text: "Each field binds to the component around it; `data-component-id` is optional."
  - icon: package
    title: No Node build
    text: "Loads with `@livewireTagifyScripts`, or as an ES module for Vite and other bundlers."
---
