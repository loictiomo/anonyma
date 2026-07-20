const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const communityRoutes = require("./routes/community.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const reactionRoutes = require("./routes/reaction.routes");
const reportRoutes = require("./routes/report.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {

      // Origines locales toujours autorisées en dev
      const defaultOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
      ];

      // Origines de prod pilotées par variable d'env Render
      // Ex: ALLOWED_ORIGINS=https://mon-app.vercel.app,https://www.mon-domaine.com
      const envOrigins = (process.env.ALLOWED_ORIGINS || "")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);

      const allowedOrigins = [...defaultOrigins, ...envOrigins];

      // Autorise les requêtes sans origine (Postman, tests...)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origine non autorisée par CORS"));
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Anonyma opérationnelle."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur Anonyma lancé sur le port ${PORT}`);
});