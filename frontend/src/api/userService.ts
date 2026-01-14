const API_A = import.meta.env.VITE_API_A_URL;

import { User, CreateUserDTO } from "../types/user";

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_A}/users`);
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  return res.json();
}

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`${API_A}/users/${id}`);
  if (!res.ok) throw new Error("Usuário não encontrado");
  return res.json();
}

export async function createUser(data: CreateUserDTO): Promise<User> {
  const res = await fetch(`${API_A}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Erro ao criar usuário");
  }

  return res.json();
}
