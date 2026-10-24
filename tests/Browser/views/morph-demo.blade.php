<div>
    <output id="renders">{{ $renders }}</output>
    <output id="labels-value">{{ json_encode($labels) }}</output>

    {{-- No wire:ignore: Livewire morphs the field on every render. --}}
    <input id="labels" data-pharaonic="tagify" wire:model.live="labels" data-direct>

    <button id="set-labels" wire:click="setLabels(['b', 'c'])">labels</button>
    <button id="refresh" wire:click="$refresh">refresh</button>
</div>
