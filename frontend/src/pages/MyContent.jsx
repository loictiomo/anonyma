import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./MyContent.css";

function MyContent() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMyContent = async () => {
    try {
      const postsRes = await api.get("/posts/mine");
      const commentsRes = await api.get("/comments/mine");

      setPosts(postsRes.data.posts);
      setComments(commentsRes.data.comments);
    } catch (err) {
      setError("Impossible de charger tes contenus.");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Veux-tu vraiment supprimer cette publication ?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/posts/${postId}`);
      loadMyContent();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  const deleteComment = async (commentId) => {
    const confirmDelete = window.confirm(
      "Veux-tu vraiment supprimer ce commentaire ?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/comments/${commentId}`);
      loadMyContent();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression.");
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

    loadMyContent();
  }, []);

  if (loading) {
    return <div className="my-content-page">Chargement...</div>;
  }

  return (
    <div className="my-content-page">
      <aside className="my-content-sidebar">
        <h1>Anonyma</h1>
        <p>Gère tes contenus.</p>

        <nav>
          <Link to="/feed">Fil d’actualité</Link>
          <Link to="/my-content">Mes contenus</Link>
        </nav>

        <button onClick={logout}>Déconnexion</button>
      </aside>

      <main className="my-content-main">
        <Link className="back-link" to="/feed">
          ← Retour au fil
        </Link>

        <h2>Mes contenus</h2>

        {error && <div className="my-content-error">{error}</div>}

        <section className="my-section">
          <h3>Mes publications</h3>

          {posts.length === 0 ? (
            <div className="empty-box">Tu n’as encore publié aucun message.</div>
          ) : (
            posts.map((post) => (
              <article className="my-card" key={post.id}>
                <div className="my-card-top">
                  <strong>{post.community_name}</strong>
                  <span>{post.status}</span>
                </div>

                <p>{post.content}</p>

                <small>
                  Affichage :{" "}
                  {post.is_fully_anonymous ? "Anonyme" : "Avec ton pseudo"}
                </small>

                <div className="my-actions">
                  <Link to={`/posts/${post.id}`}>Voir</Link>
                  <button onClick={() => deletePost(post.id)}>
                    Supprimer
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <section className="my-section">
          <h3>Mes commentaires</h3>

          {comments.length === 0 ? (
            <div className="empty-box">
              Tu n’as encore écrit aucun commentaire.
            </div>
          ) : (
            comments.map((comment) => (
              <article className="my-card" key={comment.id}>
                <div className="my-card-top">
                  <strong>{comment.community_name}</strong>
                  <span>{comment.status}</span>
                </div>

                <p>{comment.content}</p>

                <small>
                  Sur la publication : {comment.post_content.slice(0, 80)}...
                </small>

                <div className="my-actions">
                  <Link to={`/posts/${comment.post_id}`}>Voir</Link>
                  <button onClick={() => deleteComment(comment.id)}>
                    Supprimer
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

export default MyContent;