---
view: components.packages.package-hero
badges:
  - label: Livewire Package
    color: blue
  - label: "{package.latestVersionLabel}"
    color: green
  - label: "{package.license} License"
    color: purple
  - label: "{package.downloadsShort}+ downloads"
    color: blue
eyebrow: "{package.name}"
title: Tag inputs that speak
highlight: wire:model
buttons:
  - label: View Full Documentation
    href: "{card.docsUrl}"
    style: primary
    icon: arrow-right
  - label: View on GitHub
    href: "{package.githubUrl}"
    style: ghost
    external: true
install: "{card.install}"
labels:
  copy: Copy
  copied: Copied!
---

Livewire Tagify turns an `<input>` or `<textarea>` in a Livewire component into a Tagify field bound to a property in both directions. Tags, a single choice from a list, or text with mentions all stay in sync with the component without custom JavaScript.
