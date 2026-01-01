<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = new \App\Services\QuestionTemplateService();
$path = $service->generateTemplate();
$dest = storage_path('app/temp/test_manual.docx');
if (!is_dir(dirname($dest))) mkdir(dirname($dest), 0755, true);
copy($path, $dest);
echo "File created at $dest\n";
