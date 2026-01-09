<?php

use App\Http\Responses\LoginResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Checking routes...\n";
    $url = route('admin.dashboard');
    echo "Route 'admin.dashboard' resolves to: " . $url . "\n";

    $studentUrl = route('student.dashboard');
    echo "Route 'student.dashboard' resolves to: " . $studentUrl . "\n";

    echo "Checking LoginResponse binding...\n";
    $response = $app->make(LoginResponseContract::class);
    echo "LoginResponse class: " . get_class($response) . "\n";

    if ($response instanceof LoginResponse) {
        echo "Binding is correct.\n";
    } else {
        echo "Binding is INCORRECT.\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
