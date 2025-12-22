<?php

namespace App\Enums;

enum ExamTypeEnum: string
{
    case Daily = 'daily';
    case Midterm = 'midterm';
    case Final = 'final';
    case Tryout = 'tryout';
}