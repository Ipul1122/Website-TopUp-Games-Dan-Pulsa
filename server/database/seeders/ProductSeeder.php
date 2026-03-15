<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product; // Import Model

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'kode_produk' => 'ML3',
                'kategori' => 'Mobile Legends',
                'nama_produk' => '3 Diamonds (Dunia Games)',
                'harga' => 774,
                'status' => 'tersedia'
            ],
            [
                'kode_produk' => 'ML5',
                'kategori' => 'Mobile Legends',
                'nama_produk' => '5 Diamonds (Unipin)',
                'harga' => 1400,
                'status' => 'tersedia'
            ],
            [
                'kode_produk' => 'ML12',
                'kategori' => 'Mobile Legends',
                'nama_produk' => '12 Diamonds',
                'harga' => 3350,
                'status' => 'tersedia'
            ],
            [
                'kode_produk' => 'ML86',
                'kategori' => 'Mobile Legends',
                'nama_produk' => '86 Diamonds',
                'harga' => 20500,
                'status' => 'tersedia'
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}