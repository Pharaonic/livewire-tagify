<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Tagify\Tests\Browser\Fixtures;

use Illuminate\Support\Facades\Route;
use Livewire\Livewire;
use Livewire\LivewireServiceProvider;
use Orchestra\Testbench\Concerns\CreatesApplication;
use Pharaonic\Livewire\Assistant\AssistantServiceProvider;
use Pharaonic\Livewire\Tagify\TagifyServiceProvider;

final class FixtureApplication
{
    use CreatesApplication;

    public const FIXTURES = ['tagify', 'legacy', 'issue7', 'morph', 'bundle', 'defer'];

    /**
     * @param  \Illuminate\Foundation\Application  $app
     * @return array<int, class-string>
     */
    protected function getPackageProviders($app): array
    {
        return [LivewireServiceProvider::class, AssistantServiceProvider::class, TagifyServiceProvider::class];
    }

    /**
     * @param  \Illuminate\Foundation\Application  $app
     */
    protected function getEnvironmentSetUp($app): void
    {
        $app['config']->set('app.key', 'base64:'.base64_encode(str_repeat('a', 32)));
        $app['config']->set('app.debug', true);
        $app['config']->set('session.driver', 'cookie');
        $app['config']->set('livewire.middleware_group', 'web');
        $app['view']->addNamespace('fixtures', __DIR__.'/../views');

        Livewire::component('tagify-demo', TagifyDemo::class);
        Livewire::component('legacy-demo', LegacyDemo::class);
        Livewire::component('issue7-demo', Issue7Demo::class);
        Livewire::component('morph-demo', MorphDemo::class);
        Livewire::component('defer-demo', DeferDemo::class);

        Route::middleware('web')->group(function (): void {
            Route::get('/{fixture}', fn (string $fixture) => view('fixtures::page', ['fixture' => $fixture]))
                ->where('fixture', implode('|', self::FIXTURES));
        });
    }
}
