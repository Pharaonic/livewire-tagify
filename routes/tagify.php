<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Pharaonic\Livewire\Tagify\Script;
use Pharaonic\Livewire\Tagify\ScriptController;

Route::get('pharaonic/livewire-tagify/tagify.js', ScriptController::class)->name(Script::ROUTE);
