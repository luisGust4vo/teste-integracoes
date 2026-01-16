import { useEffect, useState } from "react";
import { getUsers } from "../api/userService";
import type { User } from "../types/user";
import { useNavigate } from "react-router-dom";
import "../styles/UserList.css";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Gerenciamento de Usuários</h1>
        <button onClick={() => navigate("/users/new")} className="btn-primary">
          + Novo Usuário
        </button>
      </div>

      {loading && <p className="loading">Carregando usuários...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="empty">Nenhum usuário cadastrado</p>
      )}

      {!loading && users.length > 0 && (
        <div className="user-grid">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
              <button 
                onClick={() => navigate(`/users/${user.id}`)}
                className="btn-secondary"
              >
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
