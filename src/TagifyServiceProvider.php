<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Tagify;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Pharaonic\Livewire\Assistant\AssistantServiceProvider;

final class TagifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // The directive builds on @livewireAssistantScripts, whatever the provider order.
        $this->app->register(AssistantServiceProvider::class);
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/tagify.php');

        Blade::directive('livewireTagifyScripts', [Script::class, 'directive']);

        // Deprecated aliases: <x-pharaonic-tagify::scripts /> and the "livewire-tagify" publish tag.
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'pharaonic-tagify');

        if ($this->app->runningInConsole()) {
            $this->publishes([
                Script::path() => public_path('vendor/pharaonic/pharaonic.tagify.min.js'),
            ], 'livewire-tagify');
        }
    }
}
