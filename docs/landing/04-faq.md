---
view: components.home.faq
badge: FAQ
title: "{package.name}"
highlight: Questions
subtitle: "Quick answers about installing and using {package.name}."
---

## What is {package.name}?

{card.description} It's a free, open-source {technology.name} package by Pharaonic.

## How do I install {package.name}?

Run `composer require {package.composer}` in your project's root directory, then add `@livewireTagifyScripts` to your layout.

## What does {package.name} require?

The latest release requires {package.requiresText}. Tagify is loaded by your application.

## Which Livewire versions are supported?

Every Livewire major has its own line, and Composer installs the one that matches your Livewire version. See the compatibility section of the documentation.

## Does my property hold strings or objects?

By default it holds Tagify's tag objects, such as `[{"value":"php"}]`. Add `data-direct` and it holds plain values, such as `["php"]`.

## Can I use mentions or a single choice?

Yes. Set Tagify's `mode` to `mix` for text with tags, or to `select` for one value, in `data-options`.

## Does it work with Vite?

Yes. Import Tagify from npm and set `window.Tagify`, or import the package's ES module.

## Is {package.name} free to use?

Yes. {package.name} is open source under the {package.license} license, so you can use it in personal and commercial projects.

## Where can I find the {package.name} documentation?

Read the [{package.name} documentation]({package.docsUrl}) for setup, binding, modes, options, and examples.

## How do I report a bug or contribute to {package.name}?

Open an issue or a pull request on [GitHub]({package.githubUrl}), or ask in the [Pharaonic Discord](https://discord.gg/XQG9RhvEvf).
