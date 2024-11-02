<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorComments extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'skin_analysis_id',
        'doctor_id',
        'comment',
    ];

    /**
     * Get the skin analysis result associated with the comment.
     */
    public function skinAnalysisResult()
    {
        return $this->belongsTo(SkinAnalysis::class, 'skin_analysis_id');
    }

    /**
     * Get the doctor who made the comment.
     */
    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }
}
