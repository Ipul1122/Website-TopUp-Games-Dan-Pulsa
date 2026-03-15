<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product; 
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function index()
    {
        try {
            $products = Product::where('status', 'tersedia')->get();

            // Melempar datanya ke ReactJS
            return response()->json([
                'status' => 'success',
                'data' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data dari database lokal: ' . $e->getMessage()
            ], 500);
        }
    }
}