const pool = require("../config/db");

async function adminMiddleware(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Connexion obligatoire."
      });
    }

    const [users] = await pool.query(
      "SELECT id, username, role, status FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Utilisateur introuvable."
      });
    }

    const user = users[0];

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Compte non actif."
      });
    }

    if (user.role !== "admin" && user.role !== "moderator") {
      return res.status(403).json({
        message: "Accès réservé aux administrateurs."
      });
    }

    req.admin = user;

    next();
  } catch (error) {
    console.error("Erreur admin middleware :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
}

module.exports = adminMiddleware;