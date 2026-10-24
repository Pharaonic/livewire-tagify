import { expect, test } from '@playwright/test'
import { collectConsole, errors, fields, input, problems, settle, tags, type, value } from './helpers.js'

// The markup of releases 1.0 to 1.2 and the deprecated aliases.
test.describe('1.2 markup', () => {
    for (const scripts of ['directive', 'legacy-view']) {
        test(`binds wire:model in both directions (${scripts})`, async ({ page }) => {
            await page.goto(`/legacy?scripts=${scripts}`)
            await fields(page, 3)

            expect(await tags(page, 'groups')).toEqual(['Team A'])
            await input(page, 'groups').click()
            await page.locator('.groups-menu .tagify__dropdown__item', { hasText: 'Team B' }).click()
            await expect(value(page, 'groups')).toHaveText('["Team A","Team B"]')

            await page.click('#set-groups')
            await expect(value(page, 'groups')).toHaveText('["Team C"]')
            await expect.poll(() => tags(page, 'groups')).toEqual(['Team C'])
        })
    }

    test('writes tag objects without data-direct, with the black list, data-max, and data-delimiters', async ({ page }) => {
        await page.goto('/legacy')
        await fields(page, 3)

        await input(page, 'keywords').click()
        await page.keyboard.type('one;two,spam,three,four')
        await page.keyboard.press('Enter')
        await expect(value(page, 'keywords')).toHaveText('[{"value":"one"},{"value":"two"},{"value":"three"}]')
    })

    test('enforces the suggestion list with data-suggest-enforce', async ({ page }) => {
        await page.goto('/legacy')
        await fields(page, 3)

        await type(page, 'groups', 'Nobody')
        await settle(page)
        await expect(value(page, 'groups')).toHaveText('["Team A"]')
    })

    test('keeps Tagify\'s text value away from wire:model.lazy', async ({ page }) => {
        await page.goto('/legacy')
        await fields(page, 3)

        await type(page, 'lazy', 'x')
        await expect(value(page, 'lazy')).toHaveText('["x"]')
        await settle(page)
        await expect(value(page, 'lazy')).toHaveText('["x"]')
    })

    for (const how of ['event', 'load', 'init']) {
        test(`mounts manually added fields through the deprecated ${how}`, async ({ page }) => {
            await page.goto('/legacy')
            await fields(page, 3)

            const id = await page.evaluate(() => document.querySelector('[wire\\:id]').getAttribute('wire:id'))

            await page.evaluate(([mode, componentId]) => window.addManualField(mode, componentId), [how, id])
            await fields(page, 4)
            await type(page, 'extra', 'manual')
            await expect(value(page, 'extra')).toHaveText('["manual"]')
        })
    }

    test('runs without console errors', async ({ page }) => {
        const logged = collectConsole(page)

        await page.goto('/legacy')
        await fields(page, 3)
        await type(page, 'keywords', 'fine')
        await settle(page)

        expect(problems(logged)).toEqual([])
        expect(await errors(page)).toEqual([])
    })
})
