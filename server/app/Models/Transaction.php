<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    protected $fillable = [ 'user_id','order_id', 'game_code', 'user_game_id', 'product_code', 'amount', 'status', 'snap_token'];
}