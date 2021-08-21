<?php

namespace Pharaonic\Livewire\Tagify;

use Illuminate\Support\ServiceProvider;

class TagifyServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Views
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'pharaonic-tagify');

        // Publishing
        $this->publishes([
            __DIR__.'/../public' => public_path('vendor/pharaonic'),
        ], 'livewire-tagify');
    }
}
