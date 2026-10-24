---
name: Livewire Tagify

action:
  label: View on Packagist
  href: "{package.packagistUrl}"

views: components.packages

breadcrumbs:
  - label: Home
    href: route:home
  - label: Packages
    href: route:packages.index
  - label: "{technology.name} Packages"
    href: "url:/packages/{technology.slug}"
  - label: "{package.name}"

card:
  topic: forms
  icon: tag
  tags: livewire tagify tags tag-input keywords mentions autocomplete wire:model
  description: Tagify for Livewire components, with two-way wire:model binding for tags, select, and mix modes, suggestion lists, and automatic cleanup.

seo:
  title: "{package.fullName} - Tagify tag inputs with wire:model for Livewire"
  description: "{package.name} binds Tagify tag inputs to Livewire components with two-way wire:model sync, suggestions, select and mix modes. {package.downloadsShort}+ downloads, {package.license} licensed."
  keywords: livewire tagify, tagify livewire, wire:model tagify, livewire tags input, livewire keywords, laravel tagify
  author: Pharaonic
  images:
    - "{package.cover}"
  openGraph:
    type: website
    siteName: Pharaonic
  twitter:
    card: summary_large_image

schema:
  "@type": SoftwareSourceCode
  name: "{package.name}"
  description: "{package.name} is a Livewire package that binds Tagify tag inputs to Livewire components."
  image: "{package.cover}"
  codeRepository: "{package.githubUrl}"
  programmingLanguage: JavaScript
  runtimePlatform: "{technology.name}"
  version: "{package.version}"
  datePublished: "{package.publishedAt}"
  dateModified: "{package.updatedAt}"
  license: "https://opensource.org/licenses/{package.license}"
  isAccessibleForFree: true
  sameAs:
    - "{package.githubUrl}"
    - "{package.packagistUrl}"
  author:
    "@id": url:/#organization
  publisher:
    "@id": url:/#organization
  interactionStatistic:
    "@type": InteractionCounter
    interactionType: https://schema.org/DownloadAction
    userInteractionCount: "{package.downloads}"
---
