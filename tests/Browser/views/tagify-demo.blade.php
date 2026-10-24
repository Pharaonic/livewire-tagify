<div>
    <output id="renders">{{ $renders }}</output>
    <output id="labels-value">{{ json_encode($labels) }}</output>
    <output id="skills-value">{{ json_encode($skills) }}</output>
    <output id="country-value">{{ json_encode($country) }}</output>
    <output id="note-value">{{ json_encode($note) }}</output>
    <output id="filters-value">{{ json_encode($filters['tags']) }}</output>

    @if ($show)
        <div wire:ignore wire:key="labels-field">
            <input id="labels" data-pharaonic="tagify" data-property="labels">
        </div>
    @endif

    <div wire:ignore wire:key="skills-field">
        <input id="skills" data-pharaonic="tagify" data-property="skills" data-direct data-suggest data-suggest-list='["php","laravel","livewire"]'>
    </div>

    <div wire:ignore wire:key="country-field">
        <input id="country" data-pharaonic="tagify" data-property="country" data-direct data-value="name"
            data-options='{"mode": "select", "enforceWhitelist": true, "dropdown": {"enabled": 0}, "whitelist": [{"value": "eg", "name": "Egypt"}, {"value": "jo", "name": "Jordan"}]}'>
    </div>

    <div wire:ignore wire:key="note-field">
        <textarea id="note" data-pharaonic="tagify" data-property="note"
            data-options='{"mode": "mix", "pattern": "@", "whitelist": ["Mona", "Omar"], "dropdown": {"enabled": 1, "position": "text"}}'></textarea>
    </div>

    <div wire:ignore wire:key="filters-field">
        <input id="filters" data-pharaonic="tagify" data-property="filters.tags" data-direct>
    </div>

    <button id="set-labels" wire:click="setValue('labels', ['x', 'y'])">labels</button>
    <button id="set-labels-null" wire:click="setValue('labels', null)">labels null</button>
    <button id="set-skills" wire:click="setValue('skills', ['laravel'])">skills</button>
    <button id="set-country" wire:click="setValue('country', 'jo')">country</button>
    <button id="set-country-null" wire:click="setValue('country', null)">country null</button>
    <button id="set-note" wire:click="setValue('note', 'Bye [[{&quot;value&quot;:&quot;Omar&quot;}]]')">note</button>
    <button id="toggle" wire:click="toggle">toggle</button>
    <button id="refresh" wire:click="$refresh">refresh</button>
</div>
