<div>
    <output id="keywords-value">{{ json_encode($keywords) }}</output>
    <output id="groups-value">{{ json_encode($groups) }}</output>
    <output id="lazy-value">{{ json_encode($lazy) }}</output>
    <output id="extra-value">{{ json_encode($extra) }}</output>

    <div wire:ignore>
        <input id="keywords" data-pharaonic="tagify" data-component-id="{{ $this->getId() }}" wire:model.live="keywords"
            data-black-list='["spam"]' data-max="3" data-delimiters=",|;">
    </div>

    <div wire:ignore>
        <input id="groups" data-pharaonic="tagify" data-component-id="{{ $this->getId() }}" wire:model.live="groups"
            data-suggest-list='["Team A","Team B","Team C"]' data-suggest-enforce data-direct data-classname="groups-menu">
    </div>

    {{-- An empty data-component-id, and Livewire's own change listener. --}}
    <div wire:ignore>
        <input id="lazy" data-pharaonic="tagify" data-component-id="" wire:model.lazy="lazy" data-direct>
    </div>

    <div wire:ignore id="manual"></div>

    <button id="set-groups" wire:click="setGroups(['Team C'])">groups</button>
</div>

@push('fixture-scripts')
    <script>
        window.addManualField = function (how, componentId) {
            var holder = document.getElementById('manual');

            holder.innerHTML = '<input id="extra" data-pharaonic="tagify" wire:model.live="extra" data-direct>';

            if (how === 'event') {
                window.dispatchEvent(new CustomEvent('pharaonic.tagify.load', { detail: { target: '#extra', component: componentId } }));
            } else if (how === 'load') {
                window.Pharaonic.Tagify.load(document.getElementById('extra'), componentId);
            } else {
                window.Pharaonic.Tagify.init();
            }
        };
    </script>
@endpush
