<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function store(Request $request)
        {
            $validated = $request->validate([
                'name' => 'required|min:3',
                'email' => 'required|email|unique:users,email',
            ]);

            $user = User::create([
                'uuid' => Str::uuid(),
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            // Publicar evento na fila (vem no próximo passo)

            return response()->json($user, 201);
        }

        public function index()
        {
            return User::all();
        }

        public function show($id)
        {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['message' => 'Usuário não encontrado'], 404);
            }

            return $user;
        }

}
