import { useState } from "react";
import { createUser } from "../api/userService";
import { useNavigate } from "react-router-dom";
import "../styles/UserCreate.css";

export default function UserCreate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  function validateForm() {
    const newErrors = { name: "", email: "" };
    let isValid = true;

    if (name.trim().length < 3) {
      newErrors.name = "O nome deve ter no mínimo 3 caracteres";
      isValid = false;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Digite um email válido";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await createUser({ name, email });
      setIsError(false);
      setMessage("✓ Usuário criado com sucesso!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Novo Usuário</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              placeholder="Digite o nome (mínimo 3 caracteres)"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              minLength={3}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Digite o email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="button-group">
            <button type="button" onClick={() => navigate("/")} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Criando..." : "Criar Usuário"}
            </button>
          </div>
        </form>

        {message && (
          <div className={`message ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
