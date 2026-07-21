import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Logo from "../components/brand/Logo";
import "../styles/Auth.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError("Le nom d'utilisateur est obligatoire.");
      return;
    }

    if (cleanUsername.length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        username: cleanUsername,
        password
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Impossible de créer le compte."
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
          <h2>Ta voix,<br />ton anonymat protégé.</h2>
          <p>
            Crée un compte en quelques secondes. Aucune donnée
            personnelle requise — seulement un pseudo et un mot de passe.
          </p>
        </div>

        <div className="auth-brand-ribbon" aria-hidden="true">
          <span className="ribbon-seg ribbon-green" />
          <span className="ribbon-seg ribbon-yellow" />
          <span className="ribbon-seg ribbon-red" />
        </div>
      </aside>

      <main className="auth-form-panel">
        <form className="auth-card" onSubmit={handleRegister}>

          <div className="auth-card-header">
            <h1>Créer ton compte</h1>
            <p>Rejoins Anonyma en toute confidentialité.</p>
          </div>

          {error && (
            <div className="auth-error-box">
              {error}
            </div>
          )}

          {message && (
            <div className="auth-success-box">
              {message}
            </div>
          )}

          <label htmlFor="register-username">Nom d'utilisateur</label>
          <input
            id="register-username"
            type="text"
            placeholder="Ex : voixlibre237"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="register-password">Mot de passe</label>
          <input
            id="register-password"
            type="password"
            placeholder="Minimum 6 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="register-confirm">Confirmer le mot de passe</label>
          <input
            id="register-confirm"
            type="password"
            placeholder="Répéter le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>

          <span className="auth-switch">
            Déjà inscrit ?{" "}
            <Link to="/login">Se connecter</Link>
          </span>

        </form>
      </main>

    </div>
  );
}

export default Register;