import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Window } from 'happy-dom'
import { buildOptions, withoutShorthandOverrides } from '../../resources/js/options.js'

const element = (html) => {
    const win = new Window()

    win.document.body.innerHTML = html

    return win.document.body.firstElementChild
}

const build = (html, options = {}) => buildOptions({ element: element(html), options })

test('keeps the dropdown of releases 1.0 to 1.2 without attributes', () => {
    assert.deepEqual(build('<input>'), {
        settings: {
            tagTextProp: 'value',
            dropdown: { maxItems: 25, enabled: 1, closeOnSelect: false, classname: '', mapValueTo: 'value', searchKeys: ['value'] },
        },
        key: 'value',
        direct: false,
    })
})

test('maps the shorthand attributes', () => {
    const { settings, key, direct } = build(`<input data-suggest-list='["a","b"]' data-black-list='["x"]' data-suggest-enforce data-max="3" data-classname="menu" data-value="name" data-key="id" data-direct data-delimiters=",|;">`)

    assert.deepEqual(settings, {
        tagTextProp: 'name',
        whitelist: ['a', 'b'],
        blacklist: ['x'],
        enforceWhitelist: true,
        maxTags: 3,
        delimiters: ',|;',
        dropdown: { maxItems: 25, enabled: 0, closeOnSelect: false, classname: 'menu', mapValueTo: 'name', searchKeys: ['name'] },
    })
    assert.equal(key, 'id')
    assert.equal(direct, true)
})

test('turns data-suggest on by presence and off with "false"', () => {
    assert.equal(build('<input data-suggest>').settings.dropdown.enabled, 0)
    assert.equal(build('<input data-suggest="false">').settings.dropdown.enabled, 1)
    assert.equal(build('<input data-suggest-enforce="FALSE">').settings.enforceWhitelist, undefined)
    assert.equal(build('<input data-direct="false">').direct, false)
})

test('reads a list that is not JSON with the delimiters', () => {
    assert.deepEqual(build('<input data-suggest-list="a, b,,c">').settings.whitelist, ['a', 'b', 'c'])
    assert.deepEqual(build('<input data-suggest-list="a;b|c" data-delimiters=";|\\|">').settings.whitelist, ['a', 'b', 'c'])
    assert.deepEqual(build('<input data-suggest-list="a;b">', { delimiters: ';' }).settings.whitelist, ['a', 'b'])
    assert.deepEqual(build('<input data-suggest-list="[not json">').settings.whitelist, ['[not json'])
})

test('ignores a data-max that is not a positive whole number', () => {
    for (const value of ['', '0', '-1', '2.5', 'many']) {
        assert.equal(build(`<input data-max="${value}">`).settings.maxTags, undefined, value)
    }
})

test('lets data-options override the shorthands, key by key in nested objects', () => {
    const { settings } = build('<input data-suggest data-classname="menu" data-max="3">', { maxTags: 5, mode: 'select', dropdown: { maxItems: 5 } })

    assert.equal(settings.maxTags, 5)
    assert.equal(settings.mode, 'select')
    assert.deepEqual(settings.dropdown, { maxItems: 5, enabled: 0, closeOnSelect: false, classname: 'menu', mapValueTo: 'value', searchKeys: ['value'] })
})

test('does not share data-options objects with the settings', () => {
    const options = { dropdown: { maxItems: 5 } }

    build('<input>', options).settings.dropdown.maxItems = 1
    assert.equal(options.dropdown.maxItems, 5)
})

test('hides data-suggest while the callback runs and restores it', () => {
    const input = element('<input data-suggest="x">')
    const seen = withoutShorthandOverrides(input, () => input.hasAttribute('data-suggest'))

    assert.equal(seen, false)
    assert.equal(input.getAttribute('data-suggest'), 'x')
    assert.throws(() => withoutShorthandOverrides(input, () => {
        throw new Error('boom')
    }), /boom/)
    assert.equal(input.getAttribute('data-suggest'), 'x')
})
