import { readFileSync } from 'node:fs'
import { after } from 'node:test'
import { Window } from 'happy-dom'
import { createTagify } from '../../resources/js/tagify.js'

const root = new URL('../../', import.meta.url)
const tagify = readFileSync(new URL('node_modules/@yaireo/tagify/dist/tagify.js', root), 'utf8')
const windows = []

// Tagify checks its field on an interval, which keeps a window, and the test run, alive.
after(() => Promise.all(windows.map((win) => win.happyDOM.close())))

/**
 * A component with client state, writes recorded in `writes`, and watchers
 * that a test fires through `serverSets`.
 */
export function component(data = {}) {
    const watchers = []

    return {
        data,
        writes: [],
        watchers,
        get: (path) => path.split('.').reduce((carry, key) => (carry == null ? undefined : carry[key]), data),
        set(path, value, options) {
            this.writes.push([path, value, options])

            // Like the bridge, a deferred write settles only with a later request.
            return options && options.live === false ? new Promise(() => {}) : Promise.resolve()
        },
        watch(path, callback) {
            watchers.push({ path, callback })

            return () => {}
        },
        serverSets(path, value) {
            data[path] = value
            watchers.filter((watcher) => watcher.path === path).forEach((watcher) => watcher.callback(value))
        },
    }
}

// Tagify reports a change 100ms after the tags change.
export const settle = () => new Promise((resolve) => setTimeout(resolve, 150))

/**
 * A page with real Tagify (unless `withTagify` is false) and the integration
 * created against a recording assistant.
 */
export function setup(html, { withTagify = true, modelBinding = () => null, readyState = 'complete' } = {}) {
    const win = new Window({ url: 'https://example.test/' })
    const assistantCalls = []

    windows.push(win)

    win.console.error = () => {}
    win.document.body.innerHTML = html

    if (withTagify) {
        win.eval(tagify)
    }

    Object.defineProperty(win.document, 'readyState', { configurable: true, get: () => readyState })

    const assistant = {
        destroy: (element) => assistantCalls.push(['destroy', element]),
        scan: (element) => assistantCalls.push(['scan', element]),
    }
    const integration = createTagify({ window: win, modelBinding, assistant: () => assistant })

    const mount = (selector, { property = null, options = {}, bound = component() } = {}) => {
        const element = win.document.querySelector(selector)
        const cleanup = integration.mount({ element, property, options, component: bound, onCleanup() {} })

        return { element, cleanup, component: bound, tagify: () => element.__tagify }
    }

    return {
        win,
        document: win.document,
        integration,
        mount,
        assistantCalls,
        loadTagify() {
            win.eval(tagify)
        },
    }
}
