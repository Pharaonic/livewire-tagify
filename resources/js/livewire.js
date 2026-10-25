import { readModel } from './model.js'

/**
 * Livewire 4 semantics of `wire:model`.
 *
 * A plain `wire:model` holds the update until the next request. `.live` sends
 * it at once, and so does `.lazy`, which in Livewire 4 sends on the field's
 * change: a Tagify change is that change. Without `.live`, `.change` and
 * `.blur` only time the client-side update, so they stay deferred. `.debounce`
 * and the triggers after `.live` only change when the browser sends it.
 */
export function modelBinding(element) {
    const model = readModel(element)

    if (model === null) {
        return null
    }

    const live = ['live', 'lazy'].some((modifier) => model.modifiers.includes(modifier))

    return { property: model.property, live }
}

const guarded = new WeakSet()

/**
 * Keeps Livewire 4 from writing to a Tagify field.
 *
 * `wire:model` is Alpine's `x-model` in Livewire 4: whenever the property
 * changes, locally or from the server, Alpine writes it as text into the
 * field through `_x_forceModelUpdate`, inside `wire:ignore` too. Tagify would
 * reload its tags from that text on its next check, turning tag objects into
 * "[object Object]" and dropping what the user is typing. Tagify's own value
 * is put back right after each write. Alpine may set up the field before or
 * after Tagify, so the writer is wrapped whenever it is assigned.
 */
export function guardModelWrites(window, element) {
    if (!element || guarded.has(element)) {
        return
    }

    guarded.add(element)

    const wrap = (writer) => typeof writer !== 'function' ? writer : (value) => {
        writer(value)

        if (element.__tagify && typeof element.tagifyValue === 'string') {
            element.value = element.tagifyValue
        }
    }

    let writer = wrap(element._x_forceModelUpdate)

    Object.defineProperty(element, '_x_forceModelUpdate', {
        configurable: true,
        get: () => writer,
        set: (next) => {
            writer = wrap(next)
        },
    })
}
