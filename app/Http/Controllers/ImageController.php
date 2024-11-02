<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ImageController extends Controller
{
    public function getImage($filePath)
    {


        $path = public_path($filePath);


        if (!file_exists($path)) {
            abort(404);
        }


        $mime = mime_content_type($path);


        $content = file_get_contents($path);

        return Response::make($content, 200, [
            'Content-Type' => $mime,
        ]);
    }
}
