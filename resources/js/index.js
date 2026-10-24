import { installLegacy } from './legacy.js'
import { guardModelWrites, modelBinding } from './livewire.js'
import { createTagify } from './tagify.js'

/**
 * One integration per page. The browser build and the ESM build both resolve
 * to the API stored on `window.Pharaonic.tagify`, whichever loads first.
 * The Assistant runtime is never loaded here, only registered with.
 */
function install(win) {
    const namespace = (win.Pharaonic ??= {})

    if (namespace.tagify) {
        return namespace.tagify
    }

    let assistant = null
    const pending = []

    const withAssistant = (callback) => {
        if (assistant) {
            callback(assistant)
        } else {
            pending.push(callback)
        }
    }

    const integration = createTagify({ window: win, modelBinding, guardModelWrites, assistant: () => assistant })
    const api = Object.freeze({})

    namespace.tagify = api
    installLegacy(win, namespace, withAssistant)

    const registerTagify = (runtime) => {
        assistant = runtime
        runtime.register('tagify', integration)
        pending.splice(0).forEach((callback) => callback(runtime))
    }

    if (namespace.assistant) {
        registerTagify(namespace.assistant)
    } else {
        (win.PharaonicAssistantQueue ??= []).push(registerTagify)
    }

    return api
}

install(window)
