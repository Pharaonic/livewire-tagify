import { expect, test } from '@playwright/test'
import { collectConsole, errors, fields, input, messages, problems, remove, settle, tags, type, value } from './helpers.js'

test.beforeEach(async ({ page }) => {
    await page.goto('/tagify')
    await fields(page, 5)
})

test('reflects the initial Livewire values in every mode', async ({ page }) => {
    expect(await tags(page, 'labels')).toEqual(['a'])
    expect(await tags(page, 'skills')).toEqual(['php'])
    expect(await tags(page, 'country')).toEqual(['Egypt'])
    expect(await tags(page, 'note')).toEqual(['Mona'])
    expect(await tags(page, 'filters')).toEqual([])
})

test('writes tag objects, or keys with data-direct', async ({ page }) => {
    await type(page, 'labels', 'b')
    await expect(value(page, 'labels')).toHaveText('[{"value":"a"},{"value":"b"}]')

    await type(page, 'skills', 'laravel')
    await expect(value(page, 'skills')).toHaveText('["php","laravel"]')

    await remove(page, 'skills', 'php')
    await expect(value(page, 'skills')).toHaveText('["laravel"]')
})

test('binds a dot path', async ({ page }) => {
    await type(page, 'filters', 'new')
    await expect(value(page, 'filters')).toHaveText('["new"]')
})

test('applies server-originated values without sending them back', async ({ page }) => {
    const requests = messages(page)

    await page.click('#set-labels')
    await expect(value(page, 'labels')).toHaveText('["x","y"]')
    await expect.poll(() => tags(page, 'labels')).toEqual(['x', 'y'])

    await page.click('#set-labels-null')
    await expect.poll(() => tags(page, 'labels')).toEqual([])

    await page.click('#set-skills')
    await expect.poll(() => tags(page, 'skills')).toEqual(['laravel'])

    await settle(page)
    expect(requests).toHaveLength(3)
})

test('select mode binds one key', async ({ page }) => {
    await page.locator('#country').locator('xpath=preceding-sibling::tags[1]').click()
    await page.locator('.tagify__dropdown__item', { hasText: 'Jordan' }).click()
    await expect(value(page, 'country')).toHaveText('"jo"')

    await page.click('#set-country-null')
    await expect.poll(() => tags(page, 'country')).toEqual([])

    await page.click('#set-country')
    await expect.poll(() => tags(page, 'country')).toEqual(['Jordan'])
})

test('mix mode binds the text with its tags', async ({ page }) => {
    await input(page, 'note').click()
    await page.keyboard.press('End')
    await page.keyboard.type(' and @Om')
    await page.locator('.tagify__dropdown__item', { hasText: 'Omar' }).click()

    await expect(value(page, 'note')).toContainText('Hi [[{\\"value\\":\\"Mona\\"}]]')
    await expect(value(page, 'note')).toContainText('[[{\\"value\\":\\"Omar\\",\\"prefix\\":\\"@\\"}]]')

    await page.click('#set-note')
    await expect.poll(() => tags(page, 'note')).toEqual(['Omar'])
    await expect(page.locator('#note').locator('xpath=preceding-sibling::tags[1]')).toContainText('Bye')
})

test('keeps one field across repeated renders', async ({ page }) => {
    for (let render = 2; render <= 4; render++) {
        await page.click('#refresh')
        await expect(page.locator('#renders')).toHaveText(String(render))
    }

    await settle(page)
    await fields(page, 5)
    expect(await tags(page, 'labels')).toEqual(['a'])
})

test('cleans up removed fields and mounts them again when they return', async ({ page }) => {
    await page.click('#toggle')
    await expect(page.locator('#labels')).toHaveCount(0)
    await fields(page, 4)

    await page.click('#toggle')
    await fields(page, 5)
    expect(await tags(page, 'labels')).toEqual(['a'])
})

test('does not log console errors or warnings during normal use', async ({ page }) => {
    const logged = collectConsole(page)

    await type(page, 'labels', 'c')
    await page.click('#refresh')
    await settle(page)

    expect(problems(logged)).toEqual([])
    expect(await errors(page)).toEqual([])
})
