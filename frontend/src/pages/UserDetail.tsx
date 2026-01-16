import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../api/userService";
import { getEnrichedUser } from "../api/enrichmentService";
import type { User, EnrichedUser } from "../types/user";
import "../styles/UserDetail.css";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [enriched, setEnriched] = useState<EnrichedUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingEnriched, setLoadingEnriched] = useState(true);

  useEffect(() => {
    if (!id) return;

    getUserById(id)
      .then(user => {
        setUser(user);
        setLoadingUser(false);
        return getEnrichedUser(user.uuid);
      })
      .then(setEnriched)
      .catch(() => setEnriched(null))
      .finally(() => setLoadingEnriched(false));
  }, [id]);

  if (loadingUser) return <div className="container"><p className="loading">Carregando usuário...</p></div>;
  if (!user) return <div className="container"><p className="error">Usuário não encontrado</p></div>;

  return (
    <div className="container">
      <button onClick={() => navigate("/")} className="btn-back">
        ← Voltar
      </button>

      <div className="detail-card">
        <h1>Detalhes do Usuário</h1>
        
        <div className="info-section">
          <div className="info-item">
            <label>Nome</label>
            <p>{user.name}</p>
          </div>
          
          <div className="info-item">
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <div className="info-item">
            <label>UUID</label>
            <p className="uuid">{user.uuid}</p>
          </div>
        </div>

        <div className="enriched-section">
          <h2>Dados Enriquecidos</h2>
          
          {loadingEnriched && (
            <div className="loading-enriched">
              <div className="spinner"></div>
              <p>Processando dados...</p>
            </div>
          )}
          
          {!loadingEnriched && enriched && (
            <div className="social-links">
              <div className="social-item">
                <label>LinkedIn</label>
                <a href={`https://${enriched.linkedin}`} target="_blank" rel="noopener noreferrer">
                  {enriched.linkedin}
                </a>
              </div>
              <div className="social-item">
                <label>GitHub</label>
                <a href={`https://${enriched.github}`} target="_blank" rel="noopener noreferrer">
                  {enriched.github}
                </a>
              </div>
            </div>
          )}
          
          {!loadingEnriched && !enriched && (
            <p className="not-available">Dados ainda não disponíveis. Aguarde o processamento.</p>
          )}
        </div>
      </div>
    </div>
  );
}
