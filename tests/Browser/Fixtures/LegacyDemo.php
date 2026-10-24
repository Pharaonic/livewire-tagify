<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Tagify\Tests\Browser\Fixtures;

use Livewire\Component;

/**
 * The markup of releases 1.0 to 1.2: wire:model with data-component-id, the
 * shorthand attributes, and the deprecated aliases.
 */
final class LegacyDemo extends Component
{
    /** @var mixed */
    public $keywords = [];

    /** @var mixed */
    public $groups = ['Team A'];

    /** @var mixed */
    public $lazy = [];

    /** @var mixed */
    public $extra = [];

    /**
     * @param  mixed  $value
     */
    public function setGroups($value): void
    {
        $this->groups = $value;
    }

    public function render()
    {
        return view('fixtures::legacy-demo');
    }
}
