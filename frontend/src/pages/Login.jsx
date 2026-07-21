import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Logo from "../components/brand/Logo";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError("Le nom d'utilisateur est obligatoire.");
      return;
    }

    if (!password) {
      setError("Le mot de passe est obligatoire.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        username: cleanUsername,
        password
      });

      localStorage.setItem("anonyma_token", response.data.token);
      localStorage.setItem("anonyma_user", JSON.stringify(response.data.user));

      if (
        response.data.user.role === "admin" ||
        response.data.user.role === "moderator"
      ) {
        navigate("/admin");
      } else {
        navigate("/feed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Nom d'utilisateur ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <aside className="auth-brand-panel">
        <Logo
          size={52}
          variant="light"
          tagline="Réseau social anonyme"
        />

        <div className="auth-brand-copy">
          <h2>Libre de parler,<br />responsable de respecter.</h2>
          <p>
            Un espace où ta voix compte, sans jamais exposer qui tu es
            — pensé pour des échanges honnêtes et respectueux.
          </p>
        </div>

        <div className="auth-brand-ribbon" aria-hidden="true">
          <span className="ribbon-seg ribbon-green" />
          <span className="ribbon-seg ribbon-yellow" />
          <span className="ribbon-seg ribbon-red" />
        </div>
      </aside>

      <main className="auth-form-panel">
        <form className="auth-card" onSubmit={handleLogin}>

          <div className="auth-card-header">
            <h1>Content de te revoir</h1>
            <p>Connecte-toi à ton espace Anonyma.</p>
          </div>

          {error && (
            <div className="auth-error-box">
              {error}
            </div>
          )}

          <label htmlFor="login-username">Nom d'utilisateur</label>
          <input
            id="login-username"
            type="text"
            placeholder="Ex : ivan_test"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="login-password">Mot de passe</label>
          <input
            id="login-password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <span className="auth-switch">
            Pas encore de compte ?{" "}
            <Link to="/register">Créer un compte</Link>
          </span>

        </form>
      </main>

    </div>
  );
}

export default Login;