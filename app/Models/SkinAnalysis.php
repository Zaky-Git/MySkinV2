<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkinAnalysis extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'skin_analysis';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'image_path',
        'melanoma_detected',
        'keluhan',
        'catatanDokter',
        'verified',
        'verified_by',
        'analysis_percentage',
        'is_sudah_pengajuan',
        'verification_date',
    ];

    /**
     * Get the user that owns the skin analysis result.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the doctor who verified the result.
     */
    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'verified_by');
    }
}
