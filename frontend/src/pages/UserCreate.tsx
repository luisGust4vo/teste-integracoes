import { useState } from "react";
import { createUser } from "../api/userService";
import { useNavigate } from "react-router-dom";

export default function UserCreate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createUser({ name, email });
      setMessage("Usuário criado com sucesso!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <div>
      <h1>Novo Usuário</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit">Criar</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
