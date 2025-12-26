<?php

use App\Models\Option;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

$options = Option::latest()->take(5)->get();

foreach ($options as $option) {
    echo "Option ID: " . $option->id . "\n";
    echo "Content: " . $option->content . "\n";
    $media = $option->getFirstMedia('option_media');
    if ($media) {
        echo "Media Found: Yes\n";
        echo "URL: " . $media->getUrl() . "\n";
        echo "Path: " . $media->getPath() . "\n";
    } else {
        echo "Media Found: No\n";
    }
    echo "------------------------\n";
}
