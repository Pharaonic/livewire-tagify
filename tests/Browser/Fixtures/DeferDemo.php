<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Tagify\Tests\Browser\Fixtures;

use Livewire\Component;

final class DeferDemo extends Component
{
    /** @var array<int, mixed> */
    public $draft = [];

    /** @var mixed */
    public $saved = null;

    /** @var array<int, mixed> */
    public $topic = [];

    /** @var array<int, mixed> */
    public $topics = [];

    public function save(): void
    {
        $this->saved = $this->draft;
    }

    public function topicChanged(): void
    {
        $this->topics[] = $this->topic;
    }

    public function render()
    {
        return view('fixtures::defer-demo');
    }
}
