import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

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
    <div className="register-page">
      <form className="register-card" onSubmit={handleRegister}>
        <h1>Anonyma</h1>

        <p>Créer un compte anonyme</p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {message && (
          <div className="success-box">
            {message}
          </div>
        )}

        <label>Nom d'utilisateur</label>

        <input
          type="text"
          placeholder="Ex : voixlibre237"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Mot de passe</label>

        <input
          type="password"
          placeholder="Minimum 6 caractères"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirmer le mot de passe</label>

        <input
          type="password"
          placeholder="Répéter le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Création du compte..." : "Créer mon compte"}
        </button>

        <span>
          Déjà inscrit ?{" "}
          <Link to="/login">
            Se connecter
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Register;