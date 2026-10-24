import { expect, test } from '@playwright/test'
import { collectConsole, errors, fields, input, messages, problems, settle, tags, type, value } from './helpers.js'

test('#7: the field sends one request per change, not requests without end', async ({ page }) => {
    const requests = messages(page)
    const logged = collectConsole(page)

    await page.goto('/issue7')
    await fields(page, 1)

    expect(await tags(page, 'group')).toEqual(['Team A'])

    // Tagify checks its field every 600ms; a loop shows within a few checks.
    await page.waitForTimeout(2000)
    expect(requests).toHaveLength(0)

    await input(page, 'group').click()
    await page.locator('.tagify__dropdown__item', { hasText: 'Team B' }).click()
    await expect(value(page, 'group')).toHaveText('["Team A","Team B"]')

    await page.waitForTimeout(2000)
    expect(requests).toHaveLength(1)
    expect(await tags(page, 'group')).toEqual(['Team A', 'Team B'])
    expect(problems(logged)).toEqual([])
})

test('a field outside wire:ignore survives the morph of each render', async ({ page }) => {
    await page.goto('/morph')
    await fields(page, 1)

    await type(page, 'labels', 'x')
    await expect(value(page, 'labels')).toHaveText('["a","x"]')
    await settle(page)
    await fields(page, 1)
    expect(await tags(page, 'labels')).toEqual(['a', 'x'])

    await page.click('#set-labels')
    await expect(value(page, 'labels')).toHaveText('["b","c"]')
    await expect.poll(() => tags(page, 'labels')).toEqual(['b', 'c'])

    await page.click('#refresh')
    await expect(page.locator('#renders')).toHaveText('4')
    await settle(page)
    await fields(page, 1)
    expect(await tags(page, 'labels')).toEqual(['b', 'c'])
    expect(await errors(page)).toEqual([])
})

test('works from an ES module bundle, as with Vite', async ({ page }) => {
    const logged = collectConsole(page)

    await page.goto('/bundle')
    await fields(page, 5)

    await type(page, 'skills', 'livewire')
    await expect(value(page, 'skills')).toHaveText('["php","livewire"]')
    expect(problems(logged)).toEqual([])
})
