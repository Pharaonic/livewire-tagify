<div>
    <output id="renders">{{ $renders }}</output>
    <output id="group-value">{{ json_encode($state['group']) }}</output>

    {{-- The markup from issue #7. --}}
    <div wire:ignore>
        <input id="group" data-pharaonic="tagify"
               data-component-id="{{$this->getId()}}"
               wire:model.live="state.group"
               data-suggest-list='{{json_encode(collect($groups)->pluck('name')->unique())}}'
               data-suggest
               data-direct
               placeholder="{{__('Type here to enter a new group.')}}"
        >
    </div>
</div>
