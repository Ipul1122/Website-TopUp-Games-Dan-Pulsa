<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ApiGamesService
{
    protected $merchantId;
    protected $secretKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->merchantId = env('M260312ETYL8041GO');
        $this->secretKey = env('9da3b162be00be3dcabb8afa52d1a159fa2e5b3db9c3aeb40353c94bd25638ba');
        $this->baseUrl = env('APIGAMES_BASE_URL', 'https://v1.apigames.id');
    }

    public function getProducts()
    {
        // Berdasarkan standar dokumentasi APIGames untuk melihat daftar profil/produk
        // (Pastikan mengecek dokumentasi APIGames apakah menggunakan pemisah ":" atau tidak di rumusnya)
        $signature = md5($this->merchantId . $this->secretKey);

        // Menembak endpoint produk APIGames (Umumnya di /merchant/produk)
        $response = Http::post($this->baseUrl . '/merchant/produk', [
            'merchant' => $this->merchantId,
            'signature' => $signature,
        ]);

        return $response->json();
    }
}