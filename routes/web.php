<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\ExamController;
use App\Http\Controllers\Admin\ExamManualCorrectionController;
use App\Http\Controllers\Admin\GradeController;
use App\Http\Controllers\Admin\AcademicYearController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Student Routes
    Route::prefix('student')->name('student.')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
        Route::get('exams', [\App\Http\Controllers\Student\ExamController::class, 'index'])->name('exams.index');
        Route::get('exams/{exam}', [\App\Http\Controllers\Student\ExamController::class, 'show'])->name('exams.show');
        Route::get('exams/{exam}/take', [\App\Http\Controllers\Student\ExamController::class, 'take'])->name('exams.take');
        Route::post('exams/{exam}/save-answer', [\App\Http\Controllers\Student\ExamController::class, 'saveAnswer'])->name('exams.save-answer');
        Route::post('exams/{exam}/start', [\App\Http\Controllers\Student\ExamController::class, 'start'])->name('exams.start');
        Route::post('exams/{exam}/finish', [\App\Http\Controllers\Student\ExamController::class, 'finish'])->name('exams.finish');

        // Results Routes
        Route::get('results', [\App\Http\Controllers\Student\ExamResultController::class, 'index'])->name('results.index');
        Route::get('exams/{exam}/result', [\App\Http\Controllers\Student\ExamResultController::class, 'show'])->name('exams.result'); // Keeps backward compatibility
        Route::get('results/session/{session}', [\App\Http\Controllers\Student\ExamResultController::class, 'showSession'])->name('results.show');

        Route::get('exams/{exam}/finished', [\App\Http\Controllers\Student\ExamController::class, 'finished'])->name('exams.finished');
    });

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('students/import/template', [StudentController::class, 'downloadTemplate'])->name('students.import.template');
        Route::resource('users', UserController::class);
        Route::post('students/import', [StudentController::class, 'storeImport'])->name('students.import');
        Route::resource('students', StudentController::class);
        Route::resource('subjects', App\Http\Controllers\Admin\SubjectController::class);
        Route::resource('academic-years', AcademicYearController::class);
        Route::resource('grades', \App\Http\Controllers\Admin\GradeController::class);
        Route::prefix('grades/{grade}')->name('grades.')->group(function () {
            Route::get('students', [\App\Http\Controllers\Admin\GradeStudentController::class, 'index'])->name('students.index');
            Route::post('students', [\App\Http\Controllers\Admin\GradeStudentController::class, 'store'])->name('students.store');
            Route::delete('students/{student}', [\App\Http\Controllers\Admin\GradeStudentController::class, 'destroy'])->name('students.destroy');
        });
        Route::put('exams/{exam}/regenerate-token', [\App\Http\Controllers\Admin\ExamController::class, 'regenerateToken'])->name('exams.regenerate-token');
        Route::put('exams/{exam}/toggle-token-visibility', [\App\Http\Controllers\Admin\ExamController::class, 'toggleTokenVisibility'])->name('exams.toggle-token-visibility');
        Route::get('exams/{exam}/monitor', [\App\Http\Controllers\Admin\ExamController::class, 'monitor'])->name('exams.monitor');
        Route::get('exams/sessions/{session}/correction', [\App\Http\Controllers\Admin\ExamController::class, 'correction'])->name('exams.sessions.correction');
        Route::post('exams/sessions/{session}/recalculate', [\App\Http\Controllers\Admin\ExamController::class, 'calculateScores'])->name('exams.sessions.recalculate');
        Route::get('/exams/{exam}/manual-correction', [ExamManualCorrectionController::class, 'index'])->name('exams.manual-correction.index');
        Route::post('/exams/manual-correction/score', [ExamManualCorrectionController::class, 'storeScore'])->name('exams.manual-correction.store-score');
        Route::post('/exams/manual-correction/bulk-score', [ExamManualCorrectionController::class, 'bulkStoreScore'])->name('exams.manual-correction.bulk-score');
        Route::resource('exams', \App\Http\Controllers\Admin\ExamController::class);
        Route::get('question-banks/template/download', [\App\Http\Controllers\Admin\QuestionBankController::class, 'downloadTemplate'])->name('question-banks.template.download');
        Route::resource('question-banks', \App\Http\Controllers\Admin\QuestionBankController::class);
        Route::post('question-banks/{questionBank}/upload-questions', [\App\Http\Controllers\Admin\QuestionBankController::class, 'uploadQuestions'])->name('question-banks.upload-questions');
        Route::post('questions/reorder', [\App\Http\Controllers\Admin\QuestionController::class, 'reorder'])->name('questions.reorder');
        Route::resource('questions', \App\Http\Controllers\Admin\QuestionController::class);
    });
});

require __DIR__ . '/settings.php';
