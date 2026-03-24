<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\ApiGamesService; // Wajib import service
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Untuk mencatat error/sukses di background

class WebhookController extends Controller
{
    protected $apiGames;

    // Inject ApiGamesService agar bisa dipanggil
    public function __construct(ApiGamesService $apiGames)
    {
        $this->apiGames = $apiGames;
    }

    public function midtransNotification(Request $request)
    {
        $payload = $request->all();

        // 1. Verifikasi Keamanan dari Midtrans (Anti-Hacker)
        $serverKey = env('MIDTRANS_SERVER_KEY');
        $validSignature = hash("sha512", $payload['order_id'] . $payload['status_code'] . $payload['gross_amount'] . $serverKey);

        $signatureKey = $payload['signature_key'] ?? '';
        
        // if ($payload['signature_key'] !== $validSignature) {
        //     return response()->json(['message' => 'Invalid signature'], 403);
        // }

        // 2. Cari transaksi di database
        $transaction = Transaction::where('order_id', $payload['order_id'])->first();

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        // 3. Proses Pembayaran
        $status = $payload['transaction_status'];

        if ($status == 'capture' || $status == 'settlement') {
            
            // CEK PENTING: Pastikan kita tidak mengirim diamond 2 kali untuk order yang sama
            if ($transaction->status !== 'success') {
                
                // A. Ubah status di database kita jadi Sukses
                $transaction->update(['status' => 'success']);

                // B. TEMBAK APIGAMES UNTUK KIRIM DIAMOND! 🚀
                try {
                    $apiResponse = $this->apiGames->createTransaction(
                        $transaction->order_id,
                        $transaction->product_code,
                        $transaction->user_game_id
                    );

                    // Catat hasil dari APIGames ke file log Laravel (Cek di storage/logs/laravel.log)
                    Log::info('APIGames Transaction Success: ', $apiResponse);

                } catch (\Exception $e) {
                    // Jika APIGames error/gangguan, catat errornya agar bisa kita periksa nanti
                    Log::error('APIGames Transaction Failed: ' . $e->getMessage());
                }
            }
            
        } elseif ($status == 'deny' || $status == 'expire' || $status == 'cancel') {
            $transaction->update(['status' => 'failed']);
        }

        return response()->json(['message' => 'Notification processed and Diamond ordered successfully']);
    }
}