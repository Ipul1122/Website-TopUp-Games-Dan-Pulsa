<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ApiGamesService;
use Illuminate\Http\Request;

class GameAccountController extends Controller
{
    protected $apiGames;

    public function __construct(ApiGamesService $apiGames)
    {
        $this->apiGames = $apiGames;
    }

    public function check(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'game_code' => 'required|string',
            'user_id' => 'required|string',
        ]);

        // 2. Memanggil service APIGames
        $response = $this->apiGames->checkAccount($request->game_code, $request->user_id);

        // 3. Menyesuaikan dengan struktur ASLI APIGames
        if (isset($response['status']) && $response['status'] == 1 && isset($response['data']['username'])) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'username' => $response['data']['username'] // Mengambil nama 'pulll'
                ]
            ], 200);
        }

        // 4. Jika gagal/tidak ditemukan
        return response()->json([
            'status' => 'error',
            'message' => 'Akun tidak ditemukan. Periksa kembali ID Game Anda.',
            'debug' => $response
        ], 404);
    }
}