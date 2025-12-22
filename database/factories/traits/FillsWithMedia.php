<?php

namespace Database\Factories\Traits;

use App\Models\Question;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileCannotBeAdded;

trait FillsWithMedia
{
    /**
     * Membuat file gambar dummy menggunakan GD dan menyimpannya ke Media Library.
     * * @param Question $question
     * @param string $collectionName
     * @param string $filename
     * @return string|null ULID dari Media yang baru disimpan
     */
    protected function createDummyMedia(Question $question, string $collectionName, string $filename): ?string
    {
        $tempDir = 'temp';
        $tempPath = Storage::disk('local')->path($tempDir . '/' . $filename);
        
        if (!Storage::disk('local')->exists($tempDir)) {
            Storage::disk('local')->makeDirectory($tempDir);
        }
        
        // 1. Buat Gambar Dummy dengan GD Library
        $width = 200; $height = 200;
        $image = imagecreate($width, $height);
        
        $r = rand(100, 255); $g = rand(100, 255); $b = rand(100, 255);
        $bgColor = imagecolorallocate($image, $r, $g, $b);
        $textColor = imagecolorallocate($image, 255 - $r, 255 - $g, 255 - $b);
        
        imagestring($image, 4, 10, 80, "Media Opsi", $textColor);
        imagestring($image, 3, 10, 100, $filename, $textColor);
        
        // Simpan gambar ke path sementara
        imagepng($image, $tempPath);
        imagedestroy($image);
        
        $mediaId = null;

        try {
            // 2. Simpan Gambar ke Spatie Media Library
            // Spatie menggunakan fungsi copy() atau move() tergantung konfigurasi.
            $media = $question->addMedia($tempPath)
                ->preservingOriginal()
                ->toMediaCollection($collectionName);
                
            $mediaId = $media->id; 
            
        }catch (\Exception $e) {
             // Tangkap Exception lain yang mungkin terjadi selama proses penyimpanan
            Log::error("Exception saat menyimpan media: " . $e->getMessage());
        } 
        catch (FileCannotBeAdded $e) {
            // Log error Spatie jika penyimpanan gagal
            Log::error("Spatie Media Gagal Menyimpan File Dummy: " . $e->getMessage());
        } finally {
            // 3. Hapus File Sementara dengan Pengecekan Aman
            if (file_exists($tempPath)) {
                // Gunakan @ untuk menekan error jika unlink gagal karena permission
                // Atau, yang lebih baik, gunakan Storage facade Laravel
                try {
                    Storage::disk('local')->delete($tempDir . '/' . $filename);
                } catch (\Exception $e) {
                    Log::warning("Gagal menghapus file sementara: {$tempPath}. Mungkin masalah izin.");
                }
            }
        }
        
        return $mediaId;
    }
}