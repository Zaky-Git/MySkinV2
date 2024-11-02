<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Verifications extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'doctor_id',
        'skin_analysis_id',
        'verified',
        'verification_date',
        'verified_melanoma',
    ];

    /**
     * Get the user associated with the verification.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the doctor associated with the verification.
     */
    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    /**
     * Get the skin analysis result associated with the verification.
     */
    public function skinAnalysis()
    {
        return $this->belongsTo(SkinAnalysis::class);
    }
}
