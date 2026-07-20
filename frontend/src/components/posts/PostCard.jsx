import {
  Heart,
  MessageCircle,
  Shield,
  ThumbsUp
} from "lucide-react";

import "./PostCard.css";
import { Link } from "react-router-dom";

function PostCard({
  post,
  onReaction,
  onReport
}) {
  return (
    <article className="post-card">

      <div className="post-header">

        <div className="post-avatar">
          {post.display_name === "Anonyme"
            ? "A"
            : post.display_name.charAt(0).toUpperCase()}
        </div>

        <div>

          <h4>{post.display_name}</h4>

          <span>{post.community_name}</span>

        </div>

      </div>

      <div className="post-content">
        {post.content}
      </div>

      <div className="post-stats">

        <span>
          <MessageCircle size={16}/>
          {post.comments_count}
        </span>

        <span>
          <Heart size={16}/>
          {post.reactions_count}
        </span>

      </div>

      <Link to={`/posts/${post.id}`} className="post-view-link">
        Voir / commenter
      </Link>

      <div className="post-actions">

        <button onClick={() => onReaction(post.id,"like")}>
          <ThumbsUp size={18}/>
          J'aime
        </button>

        <button onClick={() => onReaction(post.id,"support")}>
          ❤️ Soutien
        </button>

        <button onClick={() => onReaction(post.id,"interesting")}>
          💡 Intéressant
        </button>

        <button
          className="report-btn"
          onClick={() => onReport(post.id)}
        >
          <Shield size={18}/>
          Signaler
        </button>

      </div>

    </article>
  );
}

export default PostCard;