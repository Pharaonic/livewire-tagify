import { expect, test } from '@playwright/test'
import { fields, input, messages, settle, tags, type, value } from './helpers.js'

test.beforeEach(async ({ page }) => {
    await page.goto('/defer')
    await fields(page, 2)
})

test('wire:model.defer sends nothing until the next request', async ({ page }) => {
    const requests = messages(page)

    await type(page, 'draft', 'b')
    await settle(page)
    expect(requests).toHaveLength(0)
    await expect(value(page, 'draft')).toHaveText('[]')

    await page.click('#save')
    await expect(page.locator('#saved-value')).toHaveText('["b"]')
    expect(requests).toHaveLength(1)
})

test('wire:change on a deferred field carries the new value in its request', async ({ page }) => {
    const requests = messages(page)

    await type(page, 'topic', 'sport')
    await expect(page.locator('#topics-value')).toHaveText('[["sport"]]')
    await settle(page)
    expect(requests).toHaveLength(1)

    await type(page, 'topic', 'news')
    await expect(page.locator('#topics-value')).toHaveText('[["sport"],["sport","news"]]')
})

test('a field keeps what the user types while Livewire 2 writes the model value', async ({ page }) => {
    await type(page, 'topic', 'sport')
    await expect(page.locator('#topics-value')).toHaveText('[["sport"]]')
    await settle(page)

    // Each word spans a few of Tagify's 600ms checks of its field.
    for (const word of ['news', 'music', 'travel']) {
        await input(page, 'topic').click()
        await page.keyboard.type(word, { delay: 150 })
        await page.keyboard.press('Enter')
        await settle(page)
    }

    expect(await tags(page, 'topic')).toEqual(['sport', 'news', 'music', 'travel'])
})
