import { buildOptions, withoutShorthandOverrides } from './options.js'
import { createValue } from './value.js'

const same = (left, right) => JSON.stringify(left) === JSON.stringify(right)

const hasWire = (element, directive) => Array.from(element.attributes).some((attribute) => attribute.name === directive || attribute.name.startsWith(`${directive}.`))

export function tagifyError(code, message) {
    return Object.assign(new Error(message), { code })
}

/**
 * The `tagify` integration for Livewire Assistant.
 *
 * - `window` is the page window; Tagify is read from it at mount.
 * - `modelBinding(element)` reads `wire:model` with the line's Livewire semantics.
 * - `guardModelWrites(window)` keeps the line's Livewire from writing to `wire:model` fields.
 * - `assistant()` returns the runtime once it has registered this integration.
 */
export function createTagify({ window, modelBinding, guardModelWrites = () => {}, assistant }) {
    const records = new WeakMap()
    // Elements waiting for Tagify until the page has loaded.
    const waiting = new Set()

    const loaded = () => window.document.readyState === 'complete'

    if (!loaded()) {
        window.addEventListener('load', () => {
            const runtime = assistant()
            const elements = [...waiting]

            waiting.clear()
            elements.forEach((element) => {
                runtime.destroy(element)
                runtime.scan(element)
            })
        }, { once: true })
    }

    function create(element, settings) {
        return withoutShorthandOverrides(element, () => new window.Tagify(element, settings))
    }

    // Morphing a field outside wire:ignore removes the markup Tagify added before it.
    function isIntact(tagify, element) {
        return element.__tagify === tagify && tagify.DOM.scope.isConnected && tagify.DOM.scope.nextElementSibling === element
    }

    function mount(context) {
        const { element, property, component } = context

        if (typeof window.Tagify !== 'function') {
            if (!loaded()) {
                waiting.add(element)

                return () => waiting.delete(element)
            }

            throw tagifyError('tagify-missing', 'Tagify needs window.Tagify. Load it before the page finishes loading.')
        }

        const { settings, key, direct } = buildOptions({ element, options: context.options })
        const value = createValue({ settings, key, direct })
        const binding = property !== null ? { property, live: true } : modelBinding(element)
        // Livewire listens to the field for wire:model and wire:change.
        const shielded = property !== null || hasWire(element, 'wire:model') || hasWire(element, 'wire:change')
        let tagify = create(element, settings)

        if (hasWire(element, 'wire:model')) {
            guardModelWrites(window)
        }

        const apply = (incoming) => {
            if (!same(value.read(tagify), incoming)) {
                value.load(tagify, incoming)
            }
        }

        const sync = () => {
            if (binding !== null) {
                apply(component.get(binding.property))
            }
        }

        // Returns the request that carries a changed value, or null when Livewire already holds it.
        const write = () => {
            const next = value.read(tagify)

            if (same(next, component.get(binding.property))) {
                return null
            }

            return component.set(binding.property, next, { live: binding.live })
        }

        let notifying = false

        // Tagify's own change event carries its text value, which Livewire would write
        // to the property as it is. It never reaches Livewire; wire:change gets a change
        // event once the value is written instead.
        const shield = (event) => {
            if (!notifying) {
                event.stopImmediatePropagation()
            }
        }

        const notify = () => {
            if (!hasWire(element, 'wire:change')) {
                return
            }

            notifying = true

            try {
                element.dispatchEvent(new window.Event('change', { bubbles: true }))
            } finally {
                notifying = false
            }
        }

        const changed = () => {
            const written = binding === null ? Promise.resolve() : write()

            if (written === null) {
                return
            }

            const failed = (error) => window.console.error(`Tagify could not update "${binding.property}".`, error)

            if (binding !== null && !binding.live) {
                // A deferred write settles with the next request, which wire:change is about to send.
                written.catch(failed)
                notify()
            } else {
                written.then(notify, failed)
            }
        }

        if (shielded) {
            element.addEventListener('change', shield, true)
        }

        tagify.on('change', changed)

        if (binding !== null) {
            sync()
            component.watch(binding.property, apply)
        }

        records.set(element, {
            refresh() {
                if (!isIntact(tagify, element)) {
                    tagify.off('change', changed)
                    tagify.destroy()
                    tagify = create(element, settings)
                    tagify.on('change', changed)
                }

                sync()
            },
        })

        return () => {
            records.delete(element)
            element.removeEventListener('change', shield, true)
            tagify.off('change', changed)
            tagify.destroy()
        }
    }

    return {
        mount,

        // Livewire changed a field outside wire:ignore: rebuild what the morph removed.
        update({ element }) {
            const record = records.get(element)

            if (record) {
                record.refresh()
            }
        },
    }
}
