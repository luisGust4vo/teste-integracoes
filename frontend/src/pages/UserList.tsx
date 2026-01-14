import { useEffect, useState } from "react";
import { getUsers } from "../api/userService";
import type { User } from "../types/user";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Usuários</h1>
      <button onClick={() => navigate("/users/new")}>Novo Usuário</button>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => navigate(`/users/${user.id}`)}>
              Ver detalhes
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
