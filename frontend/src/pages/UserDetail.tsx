import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/userService";
import { getEnrichedUser } from "../api/enrichmentService";
import { User, EnrichedUser } from "../types/user";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [enriched, setEnriched] = useState<EnrichedUser | null>(null);
  const [loadingEnriched, setLoadingEnriched] = useState(true);

  useEffect(() => {
    if (!id) return;

    getUserById(id).then(user => {
      setUser(user);
      return getEnrichedUser(user.uuid);
    })
    .then(setEnriched)
    .catch(() => setEnriched(null))
    .finally(() => setLoadingEnriched(false));
  }, [id]);

  if (!user) return <p>Carregando usuário...</p>;

  return (
    <div>
      <h1>Detalhes do Usuário</h1>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h2>Dados Enriquecidos</h2>
      {loadingEnriched && <p>Processando dados...</p>}
      {enriched ? (
        <>
          <p>LinkedIn: {enriched.linkedin}</p>
          <p>GitHub: {enriched.github}</p>
        </>
      ) : (
        !loadingEnriched && <p>Dados ainda não disponíveis</p>
      )}
    </div>
  );
}
