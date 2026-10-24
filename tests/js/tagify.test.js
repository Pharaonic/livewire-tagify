import assert from 'node:assert/strict'
import { test } from 'node:test'
import { guardModelWrites, modelBinding } from '../../resources/js/livewire.js'
import { component, settle, setup } from './helpers.js'

// Values from the page window, as plain Node values.
const plain = (value) => JSON.parse(JSON.stringify(value))
const tags = (field) => plain(field.tagify().getCleanValue().map((tag) => tag.value))

test('shows the initial Livewire value as tags', async () => {
    const page = setup('<input id="labels">')
    const field = page.mount('#labels', { property: 'labels', bound: component({ labels: ['a', { value: 'b' }] }) })

    assert.deepEqual(tags(field), ['a', 'b'])
})

test('writes tag objects once, live, and never echoes a server value', async () => {
    const page = setup('<input id="labels">')
    const bound = component({ labels: [{ value: 'a' }] })
    const field = page.mount('#labels', { property: 'labels', bound })
    await settle()

    field.tagify().addTags(['b'])
    await settle()
    assert.deepEqual(plain(bound.writes), [['labels', [{ value: 'a' }, { value: 'b' }], { live: true }]])

    for (const [value, shown] of [[null, []], ['', []], ['solo', ['solo']], [['x', 'y'], ['x', 'y']]]) {
        bound.serverSets('labels', value)
        assert.deepEqual(tags(field), shown)
    }

    await settle()
    assert.equal(bound.writes.length, 1)
})

test('keeps newer tags when the response to an earlier write reports its value', async () => {
    const page = setup('<input id="labels">')
    const bound = component({ labels: [] })
    const field = page.mount('#labels', { property: 'labels', bound })
    await settle()

    field.tagify().addTags(['a'])
    await settle()
    field.tagify().addTags(['b'])
    await settle()
    assert.equal(bound.writes.length, 2)

    bound.serverSets('labels', [{ value: 'a' }])
    assert.deepEqual(tags(field), ['a', 'b'])

    bound.serverSets('labels', [{ value: 'a' }, { value: 'b' }])
    assert.deepEqual(tags(field), ['a', 'b'])

    // Once Livewire has reported every write, its values show again.
    bound.serverSets('labels', [{ value: 'a' }])
    assert.deepEqual(tags(field), ['a'])

    bound.serverSets('labels', ['z'])
    assert.deepEqual(tags(field), ['z'])
})

test('writes the data-key of each tag with data-direct', async () => {
    const page = setup(`<input id="labels" data-direct data-key="id" data-value="name" data-suggest-list='[{"id":1,"name":"One"},{"id":2,"name":"Two"}]'>`)
    const bound = component({ labels: [1] })
    const field = page.mount('#labels', { property: 'labels', bound })
    await settle()

    assert.deepEqual(plain(field.tagify().getCleanValue()), [{ id: 1, name: 'One', value: 'One' }])

    field.tagify().addTags([{ id: 2, name: 'Two' }])
    await settle()
    assert.deepEqual(plain(bound.writes), [['labels', [1, 2], { live: true }]])

    bound.serverSets('labels', [7])
    assert.deepEqual(plain(field.tagify().getCleanValue()), [{ name: '7', id: 7, value: '7' }])
})

test('binds one value in select mode', async () => {
    const page = setup('<input id="pick" data-direct>')
    const bound = component({ pick: 'a' })
    const field = page.mount('#pick', { property: 'pick', options: { mode: 'select', whitelist: ['a', 'b'] }, bound })
    await settle()

    assert.deepEqual(tags(field), ['a'])

    field.tagify().addTags(['b'])
    await settle()
    assert.deepEqual(plain(bound.writes).at(-1), ['pick', 'b', { live: true }])

    bound.serverSets('pick', null)
    assert.deepEqual(tags(field), [])
})

test('binds the mixed text in mix mode', async () => {
    const page = setup('<textarea id="note"></textarea>')
    const bound = component({ note: 'Hi [[{"value":"Mona"}]]' })
    const field = page.mount('#note', { property: 'note', options: { mode: 'mix', pattern: '@' }, bound })
    await settle()

    assert.deepEqual(tags(field), ['Mona'])

    field.tagify().addTags([{ value: 'Omar' }])
    await settle()
    assert.equal(bound.writes.length, 1)
    // happy-dom adds its own whitespace around the new tag; the browser suite checks the exact text.
    assert.match(bound.writes[0][1], /^Hi \[\[\{"value":"Mona"\}\]\][\s\S]*\[\[\{"value":"Omar"\}\]\]/)

    bound.serverSets('note', null)
    assert.deepEqual(tags(field), [])
})

test('does not write a value Livewire already holds', async () => {
    const page = setup('<input id="labels">')
    const bound = component({ labels: [] })
    const field = page.mount('#labels', { property: 'labels', bound })
    await settle()

    field.tagify().addTags(['a'])
    field.tagify().removeAllTags()
    await settle()
    assert.deepEqual(plain(bound.writes), [])
})

test('binds wire:model when there is no data-property, and data-property wins', async () => {
    const page = setup('<input id="a" wire:model="labels"><input id="b" wire:model="ignored">', { modelBinding })
    const a = page.mount('#a', { bound: component({ labels: ['x'] }) })
    const b = page.mount('#b', { property: 'chosen', bound: component({ chosen: ['y'], ignored: ['z'] }) })

    await settle()

    assert.deepEqual(tags(a), ['x'])
    assert.deepEqual(tags(b), ['y'])

    a.tagify().addTags(['q'])
    b.tagify().addTags(['r'])
    await settle()
    assert.deepEqual(plain(a.component.writes), [['labels', [{ value: 'x' }, { value: 'q' }], { live: true }]])
    assert.deepEqual(plain(b.component.writes), [['chosen', [{ value: 'y' }, { value: 'r' }], { live: true }]])
})

test('keeps Tagify\'s change event from Livewire and fires one for wire:change after the write', async () => {
    const page = setup('<input id="a" wire:model="labels" wire:change="changed"><input id="b" wire:model="labels"><input id="c">', { modelBinding })
    const a = page.mount('#a', { bound: component({ labels: [] }) })
    const b = page.mount('#b', { bound: component({ labels: [] }) })
    const c = page.mount('#c')

    await settle()
    const native = { a: [], b: 0, c: 0 }

    a.element.addEventListener('change', (event) => native.a.push(event.constructor.name))
    b.element.addEventListener('change', () => native.b++)
    c.element.addEventListener('change', () => native.c++)

    for (const field of [a, b, c]) {
        field.tagify().addTags(['x'])
    }

    await settle()
    assert.deepEqual(native, { a: ['Event'], b: 0, c: 1 })
})

test('reads wire:model with Livewire 2 semantics: live unless deferred', () => {
    const page = setup('<input id="a" wire:model="labels"><input id="b" wire:model.lazy="a.b"><input id="c" wire:model.debounce.500ms="c"><input id="d" wire:model=" "><input id="e"><input id="f" wire:model.defer="f">', { withTagify: false })
    const binding = (id) => modelBinding(page.document.getElementById(id))

    assert.deepEqual(binding('a'), { property: 'labels', live: true })
    assert.deepEqual(binding('b'), { property: 'a.b', live: true })
    assert.deepEqual(binding('c'), { property: 'c', live: true })
    assert.deepEqual(binding('f'), { property: 'f', live: false })
    assert.equal(binding('d'), null)
    assert.equal(binding('e'), null)
})

test('writes wire:model.defer as a deferred update, and still fires wire:change after it', async () => {
    const page = setup('<input id="a" wire:model.defer="labels" wire:change="changed">', { modelBinding })
    const field = page.mount('#a', { bound: component({ labels: [] }) })
    let native = 0

    await settle()
    field.element.addEventListener('change', () => native++)
    field.tagify().addTags(['x'])
    await settle()

    assert.deepEqual(plain(field.component.writes), [['labels', [{ value: 'x' }], { live: false }]])
    assert.equal(native, 1)
})

test('puts Tagify\'s value back after Livewire writes to a wire:model field', async () => {
    const page = setup('<input id="a" wire:model="labels"><input id="b">', { modelBinding })
    const hooks = []

    page.win.Livewire = { hook: (name, callback) => hooks.push([name, callback]) }
    guardModelWrites(page.win)
    guardModelWrites(page.win)
    assert.deepEqual(hooks.map(([name]) => name), ['interceptWireModelSetValue'])

    const field = page.mount('#a', { bound: component({ labels: [{ value: 'php' }] }) })
    const plainInput = page.document.getElementById('b')
    const ownValue = field.element.value

    for (const element of [field.element, plainInput]) {
        hooks[0][1]([{ value: 'php' }], element)
        element.value = '[object Object]'
    }

    await Promise.resolve()
    assert.equal(field.element.value, ownValue)
    assert.equal(plainInput.value, '[object Object]')
})

test('hides data-suggest from Tagify, which reads it as text to suggest', async () => {
    const page = setup('<input id="labels" data-suggest>')
    const field = page.mount('#labels')

    assert.equal(field.tagify().settings.dropdown.enabled, 0)
    assert.equal(field.element.getAttribute('data-suggest'), '')
})

test('cleanup restores the field and its listeners', async () => {
    const page = setup('<input id="labels" wire:model="labels">', { modelBinding })
    const bound = component({ labels: ['a'] })
    const field = page.mount('#labels', { bound })
    const native = []

    field.element.addEventListener('change', () => native.push('change'))
    field.cleanup()

    assert.equal(field.element.__tagify, undefined)
    assert.equal(page.document.querySelector('tags'), null)

    field.element.dispatchEvent(new page.win.Event('change'))
    assert.deepEqual(native, ['change'])
})

test('update rebuilds a field whose markup a morph removed', async () => {
    const page = setup('<div><input id="labels"></div>')
    const bound = component({ labels: ['a'] })
    const field = page.mount('#labels', { property: 'labels', bound })
    await settle()
    const first = field.tagify()

    page.integration.update({ element: field.element })
    assert.equal(field.tagify(), first)

    first.DOM.scope.remove()
    bound.data.labels = ['a', 'b']
    page.integration.update({ element: field.element })

    assert.notEqual(field.tagify(), first)
    assert.equal(page.document.querySelectorAll('tags').length, 1)
    assert.deepEqual(tags(field), ['a', 'b'])
})

test('waits for Tagify until the page has loaded', async () => {
    const page = setup('<input id="labels">', { withTagify: false, readyState: 'loading' })
    const field = page.mount('#labels')

    assert.equal(typeof field.cleanup, 'function')

    page.loadTagify()
    page.win.dispatchEvent(new page.win.Event('load'))
    assert.deepEqual(page.assistantCalls, [['destroy', field.element], ['scan', field.element]])
})

test('fails clearly when Tagify is still missing after the page has loaded', async () => {
    const page = setup('<input id="labels">', { withTagify: false })

    assert.throws(() => page.mount('#labels'), { code: 'tagify-missing' })
})
