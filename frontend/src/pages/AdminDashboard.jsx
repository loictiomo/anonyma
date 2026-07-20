import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("anonyma_token");
    localStorage.removeItem("anonyma_user");
    navigate("/login");
  };

  const loadAdminData = async () => {
    try {
      const dashboardRes = await api.get("/admin/dashboard");
      const usersRes = await api.get("/admin/users");
      const postsRes = await api.get("/admin/posts");
      const reportsRes = await api.get("/admin/reports");

      setStats(dashboardRes.data.stats);
      setUsers(usersRes.data.users);
      setPosts(postsRes.data.posts);
      setReports(reportsRes.data.reports);
    } catch (error) {
      console.error(error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, status) => {
    await api.patch(`/admin/users/${userId}/status`, { status });
    loadAdminData();
  };

  const updatePostStatus = async (postId, status) => {
    await api.patch(`/admin/posts/${postId}/status`, { status });
    loadAdminData();
  };

  const updateReportStatus = async (reportId, status) => {
    await api.patch(`/admin/reports/${reportId}/status`, { status });
    loadAdminData();
  };

  useEffect(() => {
    const token = localStorage.getItem("anonyma_token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadAdminData();
  }, []);

  if (loading) {
    return <div className="admin-page">Chargement...</div>;
  }

  if (!stats) {
    return <div className="admin-page">Accès non autorisé ou erreur de chargement.</div>;
  }

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2>Anonyma</h2>
        <p>Espace admin</p>

        <nav>
          <a href="#stats">Tableau de bord</a>
          <a href="#users">Utilisateurs</a>
          <a href="#posts">Publications</a>
          <a href="#reports">Signalements</a>
        </nav>

        <button onClick={logout}>Déconnexion</button>
      </aside>

      <main className="admin-main">
        <section id="stats">
          <h1>Tableau de bord</h1>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Utilisateurs</span>
              <strong>{stats.users}</strong>
            </div>

            <div className="stat-card">
              <span>Publications</span>
              <strong>{stats.posts}</strong>
            </div>

            <div className="stat-card">
              <span>Commentaires</span>
              <strong>{stats.comments}</strong>
            </div>

            <div className="stat-card">
              <span>Signalements en attente</span>
              <strong>{stats.pending_reports}</strong>
            </div>

            <div className="stat-card">
              <span>Communautés</span>
              <strong>{stats.communities}</strong>
            </div>
          </div>
        </section>

        <section id="users" className="admin-section">
          <h2>Utilisateurs</h2>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td>
                      <button onClick={() => updateUserStatus(user.id, "active")}>
                        Activer
                      </button>
                      <button onClick={() => updateUserStatus(user.id, "suspended")}>
                        Suspendre
                      </button>
                      <button onClick={() => updateUserStatus(user.id, "banned")}>
                        Bannir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="posts" className="admin-section">
          <h2>Publications</h2>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Auteur</th>
                  <th>Communauté</th>
                  <th>Contenu</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>{post.username}</td>
                    <td>{post.community_name}</td>
                    <td>{post.content}</td>
                    <td>{post.status}</td>
                    <td>
                      <button onClick={() => updatePostStatus(post.id, "visible")}>
                        Afficher
                      </button>
                      <button onClick={() => updatePostStatus(post.id, "hidden")}>
                        Masquer
                      </button>
                      <button onClick={() => updatePostStatus(post.id, "deleted")}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="reports" className="admin-section">
          <h2>Signalements</h2>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Motif</th>
                  <th>Détails</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.reason}</td>
                    <td>{report.details || "Aucun détail"}</td>
                    <td>{report.status}</td>
                    <td>
                      <button onClick={() => updateReportStatus(report.id, "reviewed")}>
                        Traité
                      </button>
                      <button onClick={() => updateReportStatus(report.id, "dismissed")}>
                        Rejeter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;