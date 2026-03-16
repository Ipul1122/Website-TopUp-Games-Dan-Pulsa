<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function process(Request $request)
    {
        $request->validate([
            'game_code' => 'required|string',
            'user_game_id' => 'required|string',
            'product_code' => 'required|string',
            'amount' => 'required|integer',
        ]);

        // 1. Buat Order ID Unik (Misal: TRX-6A2B...)
        $orderId = 'TRX-' . strtoupper(Str::random(8));

        // 2. Konfigurasi Midtrans
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;

        // 3. Siapkan Parameter untuk Midtrans
        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $request->amount,
            ],
            'customer_details' => [
                // Menggunakan email user yang sedang login
                'email' => $request->user()->email, 
                'first_name' => $request->user()->name,
            ],
            'item_details' => [
                [
                    'id' => $request->product_code,
                    'price' => $request->amount,
                    'quantity' => 1,
                    'name' => 'Topup ' . $request->product_code . ' (' . $request->user_game_id . ')'
                ]
            ]
        ];

        try {
            // 4. Minta Token Snap ke Midtrans
            $snapToken = Snap::getSnapToken($params);

            // 5. Simpan data transaksi ke Database kita dengan status PENDING
            Transaction::create([
                'order_id' => $orderId,
                'game_code' => $request->game_code,
                'user_game_id' => $request->user_game_id,
                'product_code' => $request->product_code,
                'amount' => $request->amount,
                'status' => 'pending',
                'snap_token' => $snapToken,
            ]);

            // 6. Kirim token ke ReactJS
            return response()->json([
                'status' => 'success',
                'snap_token' => $snapToken
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}