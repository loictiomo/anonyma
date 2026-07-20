import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./CommunityDetail.css";

function CommunityDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isFullyAnonymous, setIsFullyAnonymous] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCommunityData = async () => {
    try {
      const communityRes = await api.get(`/communities/${slug}`);
      const postsRes = await api.get(`/posts/community/${slug}`);

      setCommunity(communityRes.data.community);
      setPosts(postsRes.data.posts);
    } catch (err) {
      setError("Impossible de charger cette communauté.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setError("");

    if (!community) return;

    try {
      await api.post("/posts", {
        community_id: community.id,
        content,
        is_fully_anonymous: isFullyAnonymous
      });

      setContent("");
      setIsFullyAnonymous(true);
      loadCommunityData();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la publication.");
    }
  };

  const handleReaction = async (postId, type) => {
    try {
      await api.post("/reactions/toggle", {
        post_id: postId,
        type
      });

      loadCommunityData();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la réaction.");
    }
  };

  const handleReport = async (postId) => {
    const reason = window.prompt(
      "Motif : spam, insulte, harcelement, menace, arnaque, discours_haineux, contenu_dangereux, autre"
    );

    if (!reason) return;

    try {
      await api.post("/reports", {
        post_id: postId,
        reason,
        details: "Signalement depuis une page communauté."
      });

      alert("Signalement envoyé.");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors du signalement.");
    }
  };

  const logout = () => {
    localStorage.removeItem("anonyma_token");
    localStorage.removeItem("anonyma_user");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("anonyma_token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadCommunityData();
  }, [slug]);

  if (loading) {
    return <div className="community-page">Chargement...</div>;
  }

  if (!community) {
    return (
      <div className="community-page">
        <div className="community-main">
          <p>Communauté introuvable.</p>
          <Link to="/feed">Retour au fil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="community-page">
      <aside className="community-sidebar">
        <h1>Anonyma</h1>
        <p>Libre de parler, responsable de respecter.</p>

        <nav>
          <Link to="/feed">Fil d’actualité</Link>
          <Link to="/communities">Communautés</Link>
          <Link to="/my-content">Mes contenus</Link>
        </nav>

        <button onClick={logout}>Déconnexion</button>
      </aside>

      <main className="community-main">
        <Link className="back-link" to="/feed">
          ← Retour au fil
        </Link>

        <section className="community-header-card">
          <h2>{community.name}</h2>
          <p>{community.description}</p>

          <div className="community-rules">
            <strong>Règles :</strong>
            <span>{community.rules}</span>
          </div>
        </section>

        {error && <div className="community-error">{error}</div>}

        <section className="community-create-card">
          <h3>Publier dans {community.name}</h3>

          <form onSubmit={handleCreatePost}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Écris une publication dans ${community.name}...`}
            />

            <div className="community-anonymous-row">
              <input
                type="checkbox"
                checked={isFullyAnonymous}
                onChange={(e) => setIsFullyAnonymous(e.target.checked)}
              />
              <span>Afficher comme Anonyme</span>
            </div>

            <button type="submit">Publier</button>
          </form>
        </section>

        <section className="community-posts">
          <h3>Publications de la communauté</h3>

          {posts.length === 0 ? (
            <div className="community-empty">
              Aucune publication dans cette communauté pour le moment.
            </div>
          ) : (
            posts.map((post) => (
              <article className="community-post-card" key={post.id}>
                <div className="community-post-top">
                  <div className="community-avatar">A</div>

                  <div>
                    <strong>{post.display_name}</strong>
                    <p>{post.community_name}</p>
                  </div>
                </div>

                <p className="community-post-content">{post.content}</p>

                <div className="community-post-meta">
                  <span>{post.comments_count} commentaire(s)</span>
                  <span>{post.reactions_count} réaction(s)</span>
                </div>

                <div className="community-post-buttons">
                  <button onClick={() => handleReaction(post.id, "like")}>
                    J’aime
                  </button>

                  <button onClick={() => handleReaction(post.id, "support")}>
                    Soutien
                  </button>

                  <button onClick={() => handleReaction(post.id, "interesting")}>
                    Intéressant
                  </button>

                  <Link className="comment-link" to={`/posts/${post.id}`}>
                    Voir / commenter
                  </Link>

                  <button className="danger" onClick={() => handleReport(post.id)}>
                    Signaler
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default CommunityDetail;