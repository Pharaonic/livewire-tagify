const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const blank = (value) => value === null || value === undefined || value === ''

/**
 * The value a field binds, per Tagify mode:
 *
 * - tags: an array of tag objects, or of each tag's `key` with `direct`;
 * - select: one of those, or null;
 * - mix: Tagify's mixed text, with tags as `[[{"value":"x"}]]`.
 */
export function createValue({ settings, key, direct }) {
    const mode = settings.mode
    const textProp = settings.tagTextProp || 'value'

    // A plain value becomes the whitelist entry it names, or a tag that shows it.
    const toTag = (item, whitelist) => {
        if (isPlainObject(item)) {
            return item
        }

        const match = (whitelist || []).find((entry) => (isPlainObject(entry) ? String(entry[key]) === String(item) : String(entry) === String(item)))

        const tag = isPlainObject(match) ? { ...match } : { [textProp]: String(item), [key]: item }

        // Tagify needs a `value`; without one it stores the text "undefined".
        if (tag.value === undefined) {
            tag.value = String(tag[textProp])
        }

        return tag
    }

    return {
        read(tagify) {
            if (mode === 'mix') {
                // Tagify ends the field with a <br>, which it reads back as a line break.
                return tagify.getMixedTagsAsString().replace(/\r\n$/, '')
            }

            const tags = tagify.getCleanValue()
            const values = direct ? tags.map((tag) => tag[key]) : tags

            return mode === 'select' ? values[0] ?? null : values
        },

        // Loading never fires Tagify's change event, so nothing is written back.
        load(tagify, value) {
            if (mode === 'mix') {
                tagify.loadOriginalValues(blank(value) ? '' : String(value))

                return
            }

            const items = blank(value) ? [] : Array.isArray(value) ? value : [value]
            const tags = items.filter((item) => !blank(item)).map((item) => toTag(item, tagify.settings.whitelist))

            tagify.loadOriginalValues(tags.length > 0 ? JSON.stringify(tags) : '')
        },
    }
}
