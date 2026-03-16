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
        $this->merchantId = config('services.apigames.merchant_id');
        $this->secretKey = config('services.apigames.secret_key');
        $this->baseUrl = config('services.apigames.base_url');
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

    public function checkAccount($gameCode, $userId)
    {
        $signature = md5($this->merchantId . $this->secretKey);
        $url = "{$this->baseUrl}/merchant/{$this->merchantId}/cek-username/{$gameCode}";

        $response = Http::get($url, [
            'user_id' => $userId,
            'signature' => $signature
        ]);

        $data = $response->json();

        // --- ALAT PELACAK: Menyisipkan URL asli ke dalam error ---
        if (is_array($data)) {
            $data['debug_url_yang_dikirim'] = $url;
            $data['debug_merchant_id'] = $this->merchantId ?? 'KOSONG!';
        }

        return $data;
    }
}