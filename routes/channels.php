<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('exam.monitor.{examId}', function ($user, $examId) {
    return $user->hasRole(['admin', 'teacher']);
});

Broadcast::channel('exam.presence.{examId}', function ($user, $examId) {
    if ($user->hasRole(['admin', 'teacher'])) {
        return ['id' => $user->id, 'name' => $user->name, 'role' => 'admin'];
    }
    // Check if student is allowed in this exam? Ideally yes.
    // For now, allow any auth user (students) who are logged in.
    return ['id' => $user->id, 'name' => $user->name, 'role' => 'student'];
});
