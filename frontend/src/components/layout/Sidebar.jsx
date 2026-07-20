import { Link, useNavigate } from "react-router-dom";
import "./Layout.css";

function Sidebar({ user: userProp }) {
  const navigate = useNavigate();

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("anonyma_user"));
    } catch {
      return null;
    }
  })();

  const user = userProp || storedUser;

  const logout = () => {
    localStorage.removeItem("anonyma_token");
    localStorage.removeItem("anonyma_user");

    navigate("/login");
  };

  return (
    <aside className="feed-sidebar">

      <div className="brand-box">
        <h1>Anonyma</h1>

        <p>
          Libre de parler,
          <br />
          responsable de respecter.
        </p>
      </div>


      {user && (
        <div className="user-box">

          <span>
            Connecté comme
          </span>

          <strong>
            @{user.username}
          </strong>

          <small>
            {user.role}
          </small>

        </div>
      )}


      <nav className="sidebar-nav">

        <Link to="/feed#create">
          ✍️ Publier
        </Link>

        <Link to="/feed">
          📰 Fil d'actualité
        </Link>

        <Link to="/communities">
          👥 Communautés
        </Link>


        <Link to="/my-content">
          📂 Mes contenus
        </Link>

      </nav>


      <button
        className="logout-button"
        onClick={logout}
      >
        Déconnexion
      </button>


    </aside>
  );
}

export default Sidebar;