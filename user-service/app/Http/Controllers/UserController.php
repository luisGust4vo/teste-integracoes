<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RabbitMQService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
class UserController extends Controller
{


public function store(Request $request, RabbitMQService $rabbit)
{
    $validated = $request->validate([
        'name' => 'required|min:3',
        'email' => 'required|email|unique:users,email',
    ]);

    DB::beginTransaction();

    try {
        $user = User::create([
            'uuid' => Str::uuid(),
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $rabbit->publish([
            'event' => 'user.created',
            'uuid' => $user->uuid,
            'name' => $user->name,
        ]);

        DB::commit();

        return response()->json($user, 201);

    } catch (\Throwable $e) {
        DB::rollBack();

        return response()->json([
            'message' => 'Erro ao criar usuário'
        ], 500);
    }
}


}

