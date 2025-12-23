<?php

use App\Mcp\Servers\CbtServer;
use Laravel\Mcp\Facades\Mcp;

Mcp::local('CbtServer', CbtServer::class);
