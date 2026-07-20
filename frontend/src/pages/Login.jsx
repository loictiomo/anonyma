import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

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

      localStorage.setItem(
        "anonyma_token",
        response.data.token
      );

      localStorage.setItem(
        "anonyma_user",
        JSON.stringify(response.data.user)
      );

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
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>Anonyma</h1>

        <p>Connexion à ton espace</p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <label>Nom d'utilisateur</label>

        <input
          type="text"
          placeholder="Ex : ivan_test"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Mot de passe</label>

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <span>
          Pas encore de compte ?{" "}
          <Link to="/register">
            Créer un compte
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Login;