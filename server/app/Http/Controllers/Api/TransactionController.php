<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function history(Request $request)
    {
        // Mengambil transaksi yang hanya milik user yang sedang login, diurutkan dari yang terbaru
        $histories = Transaction::where('user_id', $request->user()->id)
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json([
            'status' => 'success',
            'data' => $histories
        ], 200);
    }
}