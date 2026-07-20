import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Globe } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("anonyma_user"));

  const handleSearch = (event) => {
    if (event.key !== "Enter" || !query.trim()) return;

    navigate(`/feed?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="navbar">

      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Rechercher une publication ou une communauté..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="navbar-right">

        <button className="icon-btn" title="Changer la langue">
          <Globe size={20} />
        </button>

        <button className="icon-btn" title="Notifications">
          <Bell size={20} />
        </button>

        <div className="user-info">
          <div className="avatar">
            {user?.username?.charAt(0).toUpperCase() || "A"}
          </div>

          <div>
            <strong>@{user?.username || "Utilisateur"}</strong>
            <small>{user?.role || "user"}</small>
          </div>
        </div>

      </div>

    </header>
  );
}

export default Navbar;