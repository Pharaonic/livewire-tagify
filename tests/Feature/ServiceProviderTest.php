<?php

declare(strict_types=1);

use Illuminate\Support\ServiceProvider;
use Pharaonic\Livewire\Assistant\AssistantServiceProvider;
use Pharaonic\Livewire\Tagify\Script;
use Pharaonic\Livewire\Tagify\TagifyServiceProvider;

it('registers the service provider and Livewire Assistant', function () {
    expect($this->app->getProviders(TagifyServiceProvider::class))->not->toBeEmpty()
        ->and($this->app->getProviders(AssistantServiceProvider::class))->toHaveCount(1);
});

it('is auto-discovered by Laravel', function () {
    $composer = json_decode((string) file_get_contents(__DIR__.'/../../composer.json'), true);

    expect($composer['extra']['laravel']['providers'])->toBe([TagifyServiceProvider::class]);
});

it('registers the script route', function () {
    expect(route('pharaonic.livewire-tagify.script', [], false))->toBe('/pharaonic/livewire-tagify/tagify.js');
});

it('keeps the deprecated publish tag', function () {
    expect(ServiceProvider::pathsToPublish(TagifyServiceProvider::class, 'livewire-tagify'))
        ->toBe([Script::path() => public_path('vendor/pharaonic/pharaonic.tagify.min.js')]);
});
