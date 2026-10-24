<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Blade;
use Pharaonic\Livewire\Assistant\Script as AssistantScript;
use Pharaonic\Livewire\Tagify\Script;

function renderBlade(string $template, array $data = []): string
{
    $path = tempnam(sys_get_temp_dir(), 'tagify').'.blade.php';

    file_put_contents($path, $template);

    try {
        return view()->file($path, $data)->render();
    } finally {
        unlink($path);
    }
}

function assistantTag(string $attributes = ''): string
{
    return '<script src="http://localhost/pharaonic/livewire-assistant/assistant.js?id='.AssistantScript::version().'" data-turbo-eval="false" data-turbolinks-eval="false"'.$attributes.'></script>';
}

function tagifyTag(string $attributes = ''): string
{
    return '<script src="http://localhost/pharaonic/livewire-tagify/tagify.js?id='.Script::version().'" data-turbo-eval="false" data-turbolinks-eval="false"'.$attributes.'></script>';
}

it('renders the Assistant runtime and the integration', function () {
    expect(renderBlade('@livewireTagifyScripts'))->toBe(assistantTag().tagifyTag());
});

it('renders once across the page, its partials, and @livewireAssistantScripts', function () {
    $directory = sys_get_temp_dir().'/tagify-views-'.uniqid();

    mkdir($directory);
    file_put_contents($directory.'/partial.blade.php', '@livewireTagifyScripts');
    file_put_contents($directory.'/page.blade.php', "@livewireAssistantScripts\n@livewireTagifyScripts\n@include('partial')\n@livewireTagifyScripts");

    view()->addLocation($directory);

    try {
        $html = view('page')->render();
    } finally {
        array_map('unlink', glob($directory.'/*.blade.php') ?: []);
        rmdir($directory);
    }

    expect(substr_count($html, '<script'))->toBe(2)
        ->and(substr_count($html, 'livewire-assistant/assistant.js'))->toBe(1)
        ->and(substr_count($html, 'livewire-tagify/tagify.js'))->toBe(1);
});

it('adds an escaped CSP nonce to both tags', function () {
    $html = renderBlade("@livewireTagifyScripts(['nonce' => \$nonce])", ['nonce' => 'a"b<c>']);

    expect($html)->toBe(assistantTag(' nonce="a&quot;b&lt;c&gt;"').tagifyTag(' nonce="a&quot;b&lt;c&gt;"'))
        ->and($html)->not->toContain('a"b<c>');
});

it('rejects unknown options and a non-string nonce', function (string $options) {
    renderBlade("@livewireTagifyScripts({$options})");
})->with([
    "['nonse' => 'x']",
    "['nonce' => 123]",
    "'nonce'",
])->throws(Exception::class);

it('compiles to the shared once mechanism', function () {
    expect(Blade::compileString('@livewireTagifyScripts'))
        ->toContain("hasRenderedOnce('pharaonic-livewire-assistant')")
        ->toContain("hasRenderedOnce('pharaonic-livewire-tagify')")
        ->toContain("markAsRenderedOnce('pharaonic-livewire-tagify')");
});

it('keeps the deprecated scripts view', function () {
    expect(view('pharaonic-tagify::components.scripts')->render())->toBe(assistantTag().tagifyTag());
});
