<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Tagify\Tests\Browser\Fixtures;

use Livewire\Component;

/**
 * One field per mode, bound through data-property, and server-side changes.
 */
final class TagifyDemo extends Component
{
    /** @var mixed */
    public $labels = [['value' => 'a']];

    /** @var mixed */
    public $skills = ['php'];

    /** @var mixed */
    public $country = 'eg';

    /** @var mixed */
    public $note = 'Hi [[{"value":"Mona"}]]';

    /** @var array<string, mixed> */
    public $filters = ['tags' => []];

    public bool $show = true;

    public int $renders = 0;

    /**
     * @param  mixed  $value
     */
    public function setValue(string $property, $value): void
    {
        $this->{$property} = $value;
    }

    public function toggle(): void
    {
        $this->show = ! $this->show;
    }

    public function render()
    {
        $this->renders++;

        return view('fixtures::tagify-demo');
    }
}
