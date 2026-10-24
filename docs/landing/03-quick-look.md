---
view: components.packages.quick-look
title: A quick look
subtitle: Mark the field and bind it; the tags follow the property both ways.
file: resources/views/livewire/profile.blade.php
language: blade
code: |
  <div wire:ignore>
      <input data-pharaonic="tagify" wire:model="skills"
             data-direct data-suggest
             data-suggest-list='@json($allSkills)'>
  </div>

  {{-- $skills = ['php', 'laravel'] --}}
---
