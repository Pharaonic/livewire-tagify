## Installation

Install the package with Composer, keep Tagify on the page, and load the scripts once.

### Requirements

- PHP 8.0 to 8.3, as supported by your Laravel version
- Laravel 7.30+, 8.75+, 9, or 10
- Livewire 2.12.7 or later (see [Compatibility](#compatibility))
- Tagify 4, loaded by your application
- A modern browser (ES2019); Internet Explorer is not supported

### Composer Installation

```bash title="Terminal" no-line-numbers
composer require pharaonic/livewire-tagify
```

Composer also installs `pharaonic/livewire-assistant`. Laravel discovers both service providers automatically. There is nothing to publish and no configuration file.

:::warning Composer and unmaintained releases
Livewire 2.12.7 and later have no known advisories, but every Laravel 7, 8, 9, and 10 release has security advisories that no release in its major fixes. Recent Composer versions refuse to install or update the framework until you allow them. If you accept the risk, allow these packages in your application's `composer.json`:

| Laravel | Packages to allow |
| --- | --- |
| 7 | `laravel/framework`, `league/commonmark`, `league/flysystem` |
| 8 | `laravel/framework`, `league/flysystem` |
| 9 on PHP 8.0 | `laravel/framework`, `symfony/http-foundation`, `symfony/mailer`, `symfony/mime`, `symfony/process`, `symfony/routing`, `symfony/yaml` |
| 9 on PHP 8.1+, 10 | `laravel/framework` |

```bash title="Terminal" no-line-numbers
composer config --json policy.advisories.ignore '{"laravel/framework": "No fixed release within this Laravel major."}'
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
<script src="https://example.com/pharaonic/livewire-assistant/assistant.js?id=3f9a1c2b7d4e5f60" data-turbo-eval="false" data-turbolinks-eval="false"></script>
<script src="https://example.com/pharaonic/livewire-tagify/tagify.js?id=0d8eee40cb71f6d7" data-turbo-eval="false" data-turbolinks-eval="false"></script>
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
