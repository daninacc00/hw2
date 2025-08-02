<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SliderImage;

class HomeController extends Controller
{
    public function index()
    {
        return view('home');
    }

    public function getSliderImages(Request $request)
    {
        try {
            $sliderImages = SliderImage::where('is_active', true)
                ->orderBy('order_index', 'asc')
                ->get();

            if ($sliderImages->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'count' => 0,
                    'message' => 'Nessuna immagine disponibile'
                ]);
            }

            $formattedImages = $sliderImages->map(function ($image) {
                return [
                    'id' => $image->id,
                    'src' => $image->src,
                    'alt' => $image->alt_text,
                    'name' => $image->name,
                    'isFreeShipping' => $image->is_free_shipping
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedImages,
                'count' => $formattedImages->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante il recupero delle immagini dello slider'
            ], 500);
        }
    }
}