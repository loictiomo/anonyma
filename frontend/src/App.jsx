import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Community from "./pages/Community";
import CommunityDetail from "./pages/CommunityDetail";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MyContent from "./pages/MyContent";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Pages publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages de l'application */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route path="/feed" element={<Feed />} />

        <Route
          path="/communities"
          element={
            <Layout>
              <Community />
            </Layout>
          }
        />

        <Route path="/communities/:slug" element={<CommunityDetail />} />

        <Route
          path="/posts/:id"
          element={
            <Layout>
              <PostDetail />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />

        <Route path="/my-content" element={<MyContent />} />

        <Route path="/admin" element={<AdminDashboard />} />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;