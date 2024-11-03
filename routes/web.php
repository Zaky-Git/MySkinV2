<?php

use Illuminate\Support\Facades\Route;

Route::get('/{vue_capture?}', function () {
    return response()->json([
        "status" => "success",
        "message" => "welcome to mobile legends",
        "laravel" => "11.0.8"
    ]);
})->where('vue_capture', '[\/\w\.-]*');
