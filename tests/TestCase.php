<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Tagify\Tests;

use Livewire\LivewireServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;
use Pharaonic\Livewire\Assistant\AssistantServiceProvider;
use Pharaonic\Livewire\Tagify\TagifyServiceProvider;

abstract class TestCase extends Orchestra
{
    /**
     * @param  \Illuminate\Foundation\Application  $app
     * @return array<int, class-string>
     */
    protected function getPackageProviders($app): array
    {
        return [
            LivewireServiceProvider::class,
            AssistantServiceProvider::class,
            TagifyServiceProvider::class,
        ];
    }
}
