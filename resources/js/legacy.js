/**
 * Deprecated aliases: `Pharaonic.Tagify.init()` and `.load(element, componentId)`,
 * and the `pharaonic.tagify.init` and `pharaonic.tagify.load` window events.
 * Livewire Assistant mounts elements by itself, including the ones Livewire adds later.
 */
export function installLegacy(win, namespace, withAssistant) {
    const scan = (root) => withAssistant((assistant) => assistant.scan(root))

    namespace.Tagify = Object.freeze({
        init: () => scan(win.document),
        load: (target, componentId) => {
            const element = typeof target === 'string' ? win.document.querySelector(target) : target

            // Releases 1.0 to 1.2 took the component id as an argument.
            if (element && typeof componentId === 'string' && componentId !== '' && !element.hasAttribute('data-component-id')) {
                element.setAttribute('data-component-id', componentId)
            }

            scan(element || win.document)
        },
    })

    win.addEventListener('pharaonic.tagify.init', () => scan(win.document))
    win.addEventListener('pharaonic.tagify.load', (event) => {
        const detail = event.detail || {}

        namespace.Tagify.load(detail.target, detail.component)
    })
}
