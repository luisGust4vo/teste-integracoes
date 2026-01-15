<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
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
                'uuid' => $user->uuid,
                'name' => $user->name,
            ]);

            DB::commit();

            return response()->json($user, 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Erro ao criar usuário: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erro ao criar usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        $users = User::all(['id', 'uuid', 'name', 'email']);
        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }
}
