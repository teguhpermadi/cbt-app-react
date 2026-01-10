<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('exam.monitor.{examId}', function ($user, $examId) {
    return $user->hasRole(['admin', 'teacher']);
});
