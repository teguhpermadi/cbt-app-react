<?php

namespace App\Exports;

use App\Models\User;
use App\Models\AcademicYear;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentsExport implements FromQuery, WithHeadings, WithMapping
{
    protected $activeAcademicYear;

    public function __construct()
    {
        $this->activeAcademicYear = AcademicYear::where('is_active', true)->first();
    }

    public function query()
    {
        return User::query()
            ->where('user_type', 'student')
            ->with(['studentData', 'grades' => function ($query) {
                if ($this->activeAcademicYear) {
                    $query->wherePivot('academic_year_id', $this->activeAcademicYear->id)
                        ->wherePivot('is_active', true);
                }
            }]);
    }

    public function headings(): array
    {
        return [
            'Name',
            'Username',
            'Email',
            'Password',
            'Grade',
            'NISN',
            'NIS',
            'Nomor Ujian',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Avatar',
            'Photo',
        ];
    }

    public function map($user): array
    {
        $grade = $user->grades->first();
        $studentData = $user->studentData;

        return [
            $user->name,
            $user->username,
            $user->email,
            $studentData ? $studentData->plain_password : '', // Show plain password
            $grade ? $grade->name : '',
            $studentData ? $studentData->nisn : '',
            $studentData ? $studentData->nis : '',
            $studentData ? $studentData->nomor_ujian : '',
            $studentData ? $studentData->jenis_kelamin : '',
            $studentData ? $studentData->tempat_lahir : '',
            $studentData ? $studentData->tanggal_lahir : '',
            $studentData ? $studentData->avatar : '',
            $studentData ? $studentData->photo : '',
        ];
    }
}
