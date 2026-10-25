<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Tagify;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\URL;
use InvalidArgumentException;

/**
 * @internal The public API is the @livewireTagifyScripts directive and the
 *           pharaonic.livewire-tagify.script route.
 */
final class Script
{
    public const ROUTE = 'pharaonic.livewire-tagify.script';

    private const ONCE = 'pharaonic-livewire-tagify';

    private static ?string $version = null;

    public static function path(): string
    {
        return dirname(__DIR__).'/dist/livewire-tagify.js';
    }

    /**
     * Content hash of the built integration, used to refresh browser caches after an update.
     */
    public static function version(): string
    {
        if (self::$version === null) {
            $hash = hash_file('sha256', self::path());

            if ($hash === false) {
                throw new InvalidArgumentException('The Pharaonic Livewire Tagify script is missing: '.self::path());
            }

            self::$version = substr($hash, 0, 16);
        }

        return self::$version;
    }

    /**
     * Compile @livewireTagifyScripts(...): the Livewire Assistant runtime and this
     * integration, each printed once per page through the view factory's @once
     * bookkeeping, so partials, layouts, and @livewireAssistantScripts share it.
     */
    public static function directive(string $expression): string
    {
        $options = trim($expression) === '' ? '[]' : $expression;
        $once = var_export(self::ONCE, true);
        $assistant = Blade::getCustomDirectives()['livewireAssistantScripts'] ?? null;
        $runtime = is_callable($assistant) ? $assistant('$__pharaonicTagifyOptions') : null;

        if (! is_string($runtime)) {
            throw new InvalidArgumentException('@livewireTagifyScripts needs the @livewireAssistantScripts directive of pharaonic/livewire-assistant.');
        }

        return '<?php $__pharaonicTagifyOptions = '.$options.'; \\'.self::class.'::validate($__pharaonicTagifyOptions); ?>'
            .$runtime
            .'<?php if (! $__env->hasRenderedOnce('.$once.')): '
            .'$__env->markAsRenderedOnce('.$once.'); '
            .'echo \\'.self::class.'::tag($__pharaonicTagifyOptions); '
            .'endif; unset($__pharaonicTagifyOptions); ?>';
    }

    /**
     * @param  mixed  $options
     */
    public static function validate($options): void
    {
        if (! is_array($options)) {
            throw new InvalidArgumentException('The options of @livewireTagifyScripts must be an array.');
        }

        $unknown = array_diff(array_keys($options), ['nonce']);

        if ($unknown !== []) {
            throw new InvalidArgumentException('Unknown @livewireTagifyScripts option: '.implode(', ', $unknown).'. The only option is "nonce".');
        }

        $nonce = $options['nonce'] ?? null;

        if ($nonce !== null && ! is_string($nonce)) {
            throw new InvalidArgumentException('The "nonce" option of @livewireTagifyScripts must be a string.');
        }
    }

    /**
     * @param  array<array-key, mixed>  $options
     */
    public static function tag(array $options = []): string
    {
        self::validate($options);

        $nonce = $options['nonce'] ?? null;
        $src = URL::route(self::ROUTE, ['id' => self::version()]);
        $nonceAttribute = is_string($nonce) ? ' nonce="'.e($nonce).'"' : '';

        // wire:navigate re-runs body scripts unless they are marked to run once.
        return '<script src="'.e($src).'" data-navigate-once="true"'.$nonceAttribute.'></script>';
    }
}
