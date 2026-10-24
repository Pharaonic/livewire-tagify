<p align="center"><a href="https://pharaonic.dev/packages/livewire/tagify" target="_blank"><img src="https://raw.githubusercontent.com/Pharaonic/livewire-tagify/develop/docs/cover.webp" alt="Livewire Tagify"></a></p>

<p align="center">
  <a href="https://php.net" target="_blank"><img src="https://img.shields.io/static/v1?label=PHP&message=8.0%20-%208.3&color=blue&style=flat-square" alt="PHP Version : 8.0 - 8.3"></a>
  <a href="https://laravel.com" target="_blank"><img src="https://img.shields.io/static/v1?label=Laravel&message=7.x%20-%2010.x&color=F05340&style=flat-square" alt="Laravel Version : 7.x - 10.x"></a>
  <a href="https://laravel-livewire.com" target="_blank"><img src="https://img.shields.io/static/v1?label=Livewire&message=2.x&color=fb70a9&style=flat-square" alt="Livewire Version : 2.x"></a>
  <img src="https://img.shields.io/static/v1?label=License&message=MIT&color=brightgreen&style=flat-square" alt="License">
  <img src="https://github.com/Pharaonic/livewire-tagify/actions/workflows/build.yml/badge.svg?branch=2.x" alt="Build">
  <br>
  <a href="https://packagist.org/packages/Pharaonic/livewire-tagify" target="_blank"><img src="https://img.shields.io/static/v1?label=Packagist&message=pharaonic/livewire-tagify&color=blue&logo=packagist&logoColor=white" alt="Source"></a>
  <a href="https://packagist.org/packages/pharaonic/livewire-tagify" target="_blank"><img src="https://poser.pugx.org/pharaonic/livewire-tagify/v" alt="Packagist Version"></a>
  <a href="https://packagist.org/packages/pharaonic/livewire-tagify" target="_blank"><img src="https://poser.pugx.org/pharaonic/livewire-tagify/downloads" alt="Packagist Downloads"></a>
</p>

<h3 align="center">Tagify for Livewire components.</h3>
<h5 align="center">Two-way <code>wire:model</code> binding for tags, select, and mix modes, built on Livewire Assistant.</h5>
<br>

## Installation

```bash
composer require pharaonic/livewire-tagify
```

Load Tagify as usual, then add the scripts once in your layout, before or after `@livewireScripts`:

```blade
@livewireScripts
@livewireTagifyScripts
```

No Node build is needed. The 2.x line supports Livewire 2.12.7+ on Laravel 7.30+, 8.75+, 9, and 10 with PHP 8.0 to 8.3.

Coming from 1.2? Run `composer require pharaonic/livewire-tagify:^2.0`. Your markup keeps working; the documentation lists what changed.

## Usage

```blade
<div wire:ignore>
    <input data-pharaonic="tagify" wire:model="skills" data-direct data-suggest data-suggest-list='["php","laravel","livewire"]'>
</div>
```

The field follows `skills` both ways: adding or removing a tag updates the component, and setting the property on the server updates the tags. With `data-direct` the property holds plain values (`["php","laravel"]`); without it, Tagify's tag objects. Shorthands such as `data-suggest-list`, `data-max`, and `data-delimiters` cover common settings; `data-options` takes any other Tagify setting as JSON, including the `select` and `mix` modes.

## Documentation

Read the full [Livewire Tagify documentation](https://pharaonic.dev/packages/livewire/tagify) for value shapes, modes, options, bundlers such as Vite, and upgrading from 1.2.

## Support & Security

See [SUPPORT.md](SUPPORT.md) and [SECURITY.md](SECURITY.md).

## License

MIT. See [LICENSE](LICENSE).
