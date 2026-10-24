import { build } from 'esbuild'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const check = process.argv.includes('--check')
const banner = { js: '/*! pharaonic/livewire-tagify | MIT License */' }

const outputs = {
    'dist/livewire-tagify.js': { format: 'iife', minify: true },
    'dist/livewire-tagify.esm.js': { format: 'esm', minify: false },
}

let stale = []

await mkdir('dist', { recursive: true })

for (const [file, options] of Object.entries(outputs)) {
    const result = await build({
        entryPoints: ['resources/js/index.js'],
        bundle: true,
        write: false,
        target: 'es2019',
        legalComments: 'none',
        banner,
        ...options,
    })

    const contents = result.outputFiles[0].text

    if (check) {
        const current = await readFile(file, 'utf8').catch(() => null)

        if (current !== contents) {
            stale.push(file)
        }
    } else {
        await writeFile(file, contents)
    }
}

if (stale.length > 0) {
    console.error(`Out of date, run "npm run build": ${stale.join(', ')}`)
    process.exit(1)
}
