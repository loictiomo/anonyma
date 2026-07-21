// Nouveau fichier : frontend/src/pages/Community.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Community.css";

function Community() {
  const [communities, setCommunities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        const res = await api.get("/communities");
        setCommunities(res.data.communities);
      } catch (err) {
        setError("Impossible de charger les communautés.");
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, []);

  if (loading) {
    return <div className="community-list-page">Chargement...</div>;
  }

  return (
    <div className="community-list-page">
      <h1>Communautés</h1>
      <p>Rejoins des espaces de discussion selon tes centres d'intérêt.</p>

      {error && <div className="community-error">{error}</div>}

      {communities.length === 0 ? (
        <div className="empty-box">Aucune communauté disponible.</div>
      ) : (
        <div className="community-list-grid">
          {communities.map((community) => (
            <Link
              key={community.id}
              to={`/communities/${community.slug}`}
              className="community-list-card"
            >
              <h3>{community.name}</h3>
              <p>{community.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Community;