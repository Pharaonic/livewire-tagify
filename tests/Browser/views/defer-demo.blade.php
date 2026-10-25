<div>
    <output id="draft-value">{{ json_encode($draft) }}</output>
    <output id="saved-value">{{ json_encode($saved) }}</output>
    <output id="topics-value">{{ json_encode($topics) }}</output>

    <div wire:ignore>
        <input id="draft" data-pharaonic="tagify" wire:model="draft" data-direct>
    </div>

    <div wire:ignore>
        <input id="topic" data-pharaonic="tagify" wire:model="topic" wire:change="topicChanged" data-direct>
    </div>

    <button id="save" wire:click="save">save</button>
</div>
