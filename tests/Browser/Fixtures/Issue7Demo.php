<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Tagify\Tests\Browser\Fixtures;

use Livewire\Component;

/**
 * The markup of issue #7, which sent requests without end.
 */
final class Issue7Demo extends Component
{
    /** @var array<string, mixed> */
    public $state = ['group' => ['Team A']];

    /** @var array<int, array<string, string>> */
    public $groups = [['name' => 'Team A'], ['name' => 'Team B'], ['name' => 'Team A']];

    public int $renders = 0;

    public function render()
    {
        $this->renders++;

        return view('fixtures::issue7-demo');
    }
}
