<?php

declare(strict_types=1);

/*
 * Front controller for the browser suite: `php -S 127.0.0.1:8124 tests/Browser/server.php`.
 * It boots a Testbench application with Livewire 4, Livewire Assistant, this
 * package, and the fixture components, and serves the few static files the
 * fixtures need.
 */

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Pharaonic\Livewire\Tagify\Tests\Browser\Fixtures\FixtureApplication;

$root = dirname(__DIR__, 2);
$path = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

$static = [
    '/static/tagify.js' => $root.'/node_modules/@yaireo/tagify/dist/tagify.js',
    '/static/tagify.css' => $root.'/node_modules/@yaireo/tagify/dist/tagify.css',
    '/static/bundle.js' => __DIR__.'/.build/bundle.js',
];

if (isset($static[$path])) {
    header('Content-Type: '.(substr($path, -4) === '.css' ? 'text/css' : 'application/javascript'));
    readfile($static[$path]);

    return true;
}

require $root.'/vendor/autoload.php';

$app = (new FixtureApplication)->createApplication();
$kernel = $app->make(Kernel::class);
$response = $kernel->handle($request = Request::capture());
$response->send();
$kernel->terminate($request, $response);
