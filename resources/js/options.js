// A shorthand is on when present, unless its value is "false".
const enabled = (value) => value.toLowerCase() !== 'false'

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const copy = (value) => (value === undefined ? {} : JSON.parse(JSON.stringify(value)))

/**
 * A list shorthand holds a JSON array, or a list split by the delimiters the
 * way Tagify reads its own `data-whitelist`.
 */
function list(value, delimiters) {
    if (value.startsWith('[')) {
        try {
            const parsed = JSON.parse(value)

            if (Array.isArray(parsed)) {
                return parsed
            }
        } catch {
            // Not JSON: read it as a delimited list.
        }
    }

    return value
        .split(delimiters instanceof RegExp ? delimiters : new RegExp(typeof delimiters === 'string' && delimiters !== '' ? delimiters : ','))
        .map((item) => item.trim())
        .filter((item) => item !== '')
}

// The dropdown releases 1.0 to 1.2 configured for every field.
const defaults = () => ({
    tagTextProp: 'value',
    dropdown: {
        maxItems: 25,
        enabled: 1,
        closeOnSelect: false,
        classname: '',
        mapValueTo: 'value',
        searchKeys: ['value'],
    },
})

/**
 * Shorthand attributes for the most common Tagify settings. Tagify reads no
 * settings from attributes except `data-whitelist` and `data-blacklist`.
 */
const SHORTHANDS = {
    'data-delimiters': (settings, value) => {
        if (value !== '') {
            settings.delimiters = value
        }
    },
    'data-suggest': (settings, value) => {
        if (enabled(value)) {
            settings.dropdown.enabled = 0
        }
    },
    'data-suggest-enforce': (settings, value) => {
        if (enabled(value)) {
            settings.enforceWhitelist = true
            settings.dropdown.enabled = 0
        }
    },
    'data-max': (settings, value) => {
        const max = Number(value)

        if (value !== '' && Number.isInteger(max) && max > 0) {
            settings.maxTags = max
        }
    },
    'data-classname': (settings, value) => {
        settings.dropdown.classname = value
    },
    'data-value': (settings, value) => {
        if (value !== '') {
            settings.tagTextProp = value
            settings.dropdown.mapValueTo = value
            settings.dropdown.searchKeys = [value]
        }
    },
}

// Read after the delimiters are known, so a delimited list splits on them.
const LISTS = {
    'data-suggest-list': 'whitelist',
    'data-black-list': 'blacklist',
}

function merge(target, source) {
    for (const [key, value] of Object.entries(source)) {
        if (isPlainObject(value) && isPlainObject(target[key])) {
            merge(target[key], value)
        } else {
            target[key] = value
        }
    }

    return target
}

/**
 * Build the Tagify settings of an element: the defaults, then the shorthand
 * attributes, then `data-options`, merged key by key into nested objects.
 * `data-key` and `data-direct` shape the bound value and are returned apart.
 */
export function buildOptions({ element, options }) {
    const settings = defaults()
    const read = (attribute) => (element.hasAttribute(attribute) ? element.getAttribute(attribute).trim() : null)

    for (const [attribute, apply] of Object.entries(SHORTHANDS)) {
        const value = read(attribute)

        if (value !== null) {
            apply(settings, value)
        }
    }

    const given = copy(options)
    const delimiters = given.delimiters ?? settings.delimiters

    for (const [attribute, setting] of Object.entries(LISTS)) {
        const value = read(attribute)

        if (value !== null && value !== '') {
            settings[setting] = list(value, delimiters)
        }
    }

    merge(settings, given)

    const direct = read('data-direct')
    const key = read('data-key')

    return {
        settings,
        key: key === null || key === '' ? 'value' : key,
        direct: direct !== null && enabled(direct),
    }
}

/**
 * Tagify reads `data-suggest` as text to suggest while the user types, so the
 * shorthand is hidden while Tagify builds the field.
 */
export function withoutShorthandOverrides(element, callback) {
    const hidden = []

    if (element.hasAttribute('data-suggest')) {
        hidden.push(['data-suggest', element.getAttribute('data-suggest')])
        element.removeAttribute('data-suggest')
    }

    try {
        return callback()
    } finally {
        hidden.forEach(([name, value]) => element.setAttribute(name, value))
    }
}
