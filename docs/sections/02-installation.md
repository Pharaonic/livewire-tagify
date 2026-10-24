## Installation

Install the package with Composer, keep Tagify on the page, and load the scripts once.

### Requirements

- PHP 7.4 (Livewire 1 only installs on PHP 7)
- Laravel 7.30+ or 8.75+
- Livewire 1.3.0 to 1.3.9, except 1.3.7 (see [Compatibility](#compatibility))
- Tagify 4, loaded by your application
- A modern browser (ES2019); Internet Explorer is not supported

### Composer Installation

```bash title="Terminal" no-line-numbers
composer require pharaonic/livewire-tagify
```

Composer also installs `pharaonic/livewire-assistant`. Laravel discovers both service providers automatically. There is nothing to publish and no configuration file.

:::warning Composer and unmaintained releases
Every Livewire 1 release, and every Laravel 7 and 8 release, has security advisories that no release in its major fixes. Recent Composer versions refuse to install or update them until you allow them. If you accept the risk, allow them in your application's `composer.json`:

```bash title="Terminal" no-line-numbers
composer config --json policy.advisories.ignore '{"livewire/livewire": "No fixed release within Livewire 1.", "laravel/framework": "No fixed release within this Laravel major.", "league/commonmark": "No fixed release within this Laravel major.", "league/flysystem": "No fixed release within this Laravel major."}'
```

Read [Compatibility](#compatibility) before accepting the risk.
:::

### Load the Scripts

Load Tagify and its stylesheet the way you already do, then add `@livewireTagifyScripts` to your layout. It can go before or after `@livewireScripts`.

```blade title="resources/views/layouts/app.blade.php"
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@yaireo/tagify@4.39.0/dist/tagify.css">
    <script src="https://cdn.jsdelivr.net/npm/@yaireo/tagify@4.39.0/dist/tagify.js"></script>
    @livewireStyles
</head>
<body>
    {{ $slot }}

    @livewireScripts
    @livewireTagifyScripts
</body>
```

The directive renders two `<script>` tags: the Livewire Assistant runtime and this integration. Each is rendered once per page, even when layouts, partials, and `@livewireAssistantScripts` ask for it again.

```html no-copy
<script src="https://example.com/pharaonic/livewire-assistant/assistant.js?id=3f9a1c2b7d4e5f60" data-turbolinks-eval="false"></script>
<script src="https://example.com/pharaonic/livewire-tagify/tagify.js?id=0d8eee40cb71f6d7" data-turbolinks-eval="false"></script>
```

Tagify is read from `window.Tagify` when a field mounts, not when the script loads, so its order relative to the directive does not matter. If it is still missing when the page has finished loading, the field is reported as `mount-failed` with the `tagify-missing` cause.

### Vite and Other Bundlers

When Tagify comes from npm, expose it on `window`:

```js title="resources/js/app.js"
import Tagify from '@yaireo/tagify'
import '@yaireo/tagify/dist/tagify.css'

window.Tagify = Tagify
```

Keep `@livewireTagifyScripts` in the layout, or import the ES modules instead (see below).

### Content Security Policy

Pass a nonce when your CSP uses one. Both tags get it, escaped.

```blade title="resources/views/layouts/app.blade.php"
@livewireTagifyScripts(['nonce' => $cspNonce])
```

`nonce` is the only option. An unknown option or a non-string nonce throws an `InvalidArgumentException` while the view renders. The scripts never use `eval` or inline code.

### How the Script Is Served

| Route | Name |
| --- | --- |
| `GET /pharaonic/livewire-tagify/tagify.js` | `pharaonic.livewire-tagify.script` |

The route serves `dist/livewire-tagify.js` from the installed package, without session or cookies. The `id` query value is a hash of the file: a matching `id` is cached for a year, anything else is served with `no-cache`. After `composer update` the hash changes, so browsers fetch the new script on the next page load. Nothing needs publishing, and the route works with `php artisan route:cache`.

### ES Module

If you bundle your JavaScript, import the ES modules from the Composer packages instead of using the directive. Import the Assistant too: the integration registers with it but never loads it.

```js title="resources/js/app.js"
import Tagify from '@yaireo/tagify'
import '../../vendor/pharaonic/livewire-assistant/dist/livewire-assistant.esm.js'
import '../../vendor/pharaonic/livewire-tagify/dist/livewire-tagify.esm.js'

window.Tagify = Tagify
```

The ES module and the browser build share one integration per page, so loading both is harmless.

:::success Installation Complete
Mark a field with `data-pharaonic="tagify"` and you are done. See [Basic Usage](#basic-usage).
:::
