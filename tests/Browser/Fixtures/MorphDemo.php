<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Tagify\Tests\Browser\Fixtures;

use Livewire\Component;

/**
 * A field outside wire:ignore, which Livewire morphs on every render.
 */
final class MorphDemo extends Component
{
    /** @var mixed */
    public $labels = ['a'];

    public int $renders = 0;

    public function setLabels(array $labels): void
    {
        $this->labels = $labels;
    }

    public function render()
    {
        $this->renders++;

        return view('fixtures::morph-demo');
    }
}
