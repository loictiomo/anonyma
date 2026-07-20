import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./PostDetail.css";

  function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [isFullyAnonymous, setIsFullyAnonymous] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPostData = async () => {
    try {
      const postRes = await api.get(`/posts/${id}`);
      const commentsRes = await api.get(`/comments/post/${id}`);

      setPost(postRes.data.post);
      setComments(commentsRes.data.comments);
    } catch (err) {
      setError("Impossible de charger cette publication.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/comments", {
        post_id: Number(id),
        content,
        is_fully_anonymous: isFullyAnonymous
      });

      setContent("");
      setIsFullyAnonymous(true);
      loadPostData();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du commentaire.");
    }
  };

  const handleReaction = async (type) => {
    try {
      await api.post("/reactions/toggle", {
        post_id: Number(id),
        type
      });

      loadPostData();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la réaction.");
    }
  };

  const handleReport = async () => {
    const reason = window.prompt(
      "Motif : spam, insulte, harcelement, menace, arnaque, discours_haineux, contenu_dangereux, autre"
    );

    if (!reason) return;

    try {
      await api.post("/reports", {
        post_id: Number(id),
        reason,
        details: "Signalement envoyé depuis la page détail."
      });

      alert("Signalement envoyé.");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors du signalement.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("anonyma_token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadPostData();
  }, [id]);

  if (loading) {
    return <div className="post-detail-page">Chargement...</div>;
  }

  if (!post) {
    return (
      <div className="post-detail-page">
        <div className="post-detail-container">
          <p>Publication introuvable.</p>
          <Link to="/feed">Retour au fil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <Link className="back-link" to="/feed">
          ← Retour au fil d’actualité
        </Link>

        {error && <div className="detail-error">{error}</div>}

        <article className="detail-post-card">
          <div className="detail-post-top">
            <div className="detail-avatar">A</div>

            <div>
              <strong>{post.display_name}</strong>
              <p>{post.community_name}</p>
            </div>
          </div>

          <p className="detail-post-content">{post.content}</p>

          <div className="detail-buttons">
            <button onClick={() => handleReaction("like")}>J’aime</button>
            <button onClick={() => handleReaction("support")}>Soutien</button>
            <button onClick={() => handleReaction("interesting")}>
              Intéressant
            </button>
            <button className="danger" onClick={handleReport}>
              Signaler
            </button>
          </div>
        </article>

        <section className="comment-form-card">
          <h2>Ajouter un commentaire</h2>

          <form onSubmit={handleCreateComment}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écris ton commentaire anonymement..."
            />

            <div className="comment-anonymous-row">
              <input
                type="checkbox"
                checked={isFullyAnonymous}
                onChange={(e) => setIsFullyAnonymous(e.target.checked)}
              />
              <span>Afficher comme Anonyme</span>
            </div>

            <button type="submit">Commenter</button>
          </form>
        </section>

        <section className="comments-section">
          <h2>Commentaires</h2>

          {comments.length === 0 ? (
            <div className="empty-comments">
              Aucun commentaire pour le moment.
            </div>
          ) : (
            comments.map((comment) => (
              <div className="comment-card" key={comment.id}>
                <div className="comment-top">
                  <div className="comment-avatar">A</div>
                  <strong>{comment.display_name}</strong>
                </div>

                <p>{comment.content}</p>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default PostDetail;