import { expect } from '@playwright/test'

export const value = (page, id) => page.locator(`#${id}-value`)
export const errors = (page) => page.evaluate(() => window.fixtureErrors)

// The text of each tag Tagify shows for a field.
export const tags = (page, id) => page.evaluate((fieldId) => {
    const tagify = document.getElementById(fieldId).__tagify

    return tagify ? tagify.getCleanValue().map((tag) => tag[tagify.settings.tagTextProp]) : null
}, id)

// The editable part of the Tagify field that replaced an element.
export const input = (page, id) => page.locator(`#${id}`).locator('xpath=preceding-sibling::tags[1]').locator('.tagify__input')

export async function fields(page, count) {
    await expect(page.locator('tags.tagify')).toHaveCount(count)
}

export async function type(page, id, text) {
    await input(page, id).click()
    await page.keyboard.type(text)
    await page.keyboard.press('Enter')
}

export async function remove(page, id, text) {
    await page.locator(`#${id}`).locator('xpath=preceding-sibling::tags[1]').locator('tag', { hasText: text }).locator('.tagify__tag__removeBtn').click()
}

export async function settle(page) {
    // Tagify reports changes after 100ms, and Livewire debounces messages by 5ms.
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 150)))
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 20)))
}

export function messages(page) {
    const requests = []

    page.on('request', (request) => request.url().includes('/livewire/message/') && requests.push(request.postDataJSON()))

    return requests
}

export function collectConsole(page) {
    const logged = []

    page.on('console', (message) => logged.push({ type: message.type(), text: message.text() }))
    page.on('pageerror', (error) => logged.push({ type: 'pageerror', text: error.message }))

    return logged
}

// Firefox reports Tagify reading deprecated event properties when it copies an event.
const browserDeprecation = (message) => message.type === 'warning' && /^\[JavaScript Warning: ".+ is deprecated\./.test(message.text)

export const problems = (logged) => logged.filter((message) => (message.type === 'error' || message.type === 'pageerror' || message.type === 'warning') && !browserDeprecation(message))
