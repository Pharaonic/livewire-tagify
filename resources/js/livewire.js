import { readModel } from './model.js'

/**
 * Livewire 1 semantics of `wire:model`.
 *
 * Every Livewire 1 model update is live: Livewire 1 has no deferred updates,
 * and `.lazy` and `.debounce` only change when the browser sends it.
 */
export function modelBinding(element) {
    const model = readModel(element)

    return model === null ? null : { property: model.property, live: true }
}

const guarded = new WeakSet()

/**
 * Keeps Livewire 1 from writing to Tagify fields.
 *
 * After a response that changed a property, Livewire 1 writes the model value
 * as text into every `wire:model` field without focus, inside `wire:ignore` too.
 * Tagify would reload its tags from that text on its next check, turning tag
 * objects into "[object Object]" and dropping what the user is typing. Tagify's
 * own value is put back right after the write, before Tagify checks.
 */
export function guardModelWrites(window) {
    const livewire = window.livewire

    if (guarded.has(window) || !livewire || typeof livewire.hook !== 'function') {
        return
    }

    guarded.add(window)
    livewire.hook('interceptWireModelSetValue', (domElement) => {
        const element = domElement && domElement.el

        if (element && element.__tagify && typeof element.tagifyValue === 'string') {
            window.queueMicrotask(() => {
                element.value = element.tagifyValue
            })
        }
    })
}
