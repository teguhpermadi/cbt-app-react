<?php

namespace App\Enums;

enum ReviewStatusEnum: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Revision = 'revision'; // Membutuhkan revisi oleh pembuat soal
}