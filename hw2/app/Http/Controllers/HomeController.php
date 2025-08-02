<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SliderImage;

class HomeController extends Controller
{
    /**
     * Mostra la home page
     */
    public function index()
    {
        return view('home');
    }

    /**
     * API per ottenere le immagini dello slider
     * Migrazione da /api/landing/getSliderImages.php
     */
    public function getSliderImages(Request $request)
    {
        try {
            // Recupera le immagini dello slider attive e ordinate usando query builder
            $sliderImages = SliderImage::where('is_active', true)
                ->orderBy('order_index', 'asc')
                ->get();

            // Se non ci sono immagini
            if ($sliderImages->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'count' => 0,
                    'message' => 'Nessuna immagine disponibile'
                ]);
            }

            // Formatta i dati per l'API JavaScript nel controller
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
                'message' => 'Errore durante il recupero delle immagini dello slider',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}