const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(client => {
    console.log("Connexion PostgreSQL réussie.");
    client.release();
  })
  .catch(error => {
    console.error("Erreur connexion PostgreSQL :", error.message);
  });

module.exports = pool;