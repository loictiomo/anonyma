const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();


// Inscription
router.post("/register", async (req, res) => {
  try {

    const { username, password } = req.body;


    if (!username || !password) {
      return res.status(400).json({
        message: "Nom d'utilisateur et mot de passe obligatoires."
      });
    }


    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        message: "Le nom d'utilisateur doit contenir entre 3 et 30 caractères."
      });
    }


    if (password.length < 6) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 6 caractères."
      });
    }



    // Vérification existence utilisateur
    const existingUsers = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );


    if (existingUsers.rows.length > 0) {
      return res.status(409).json({
        message: "Ce nom d'utilisateur est déjà utilisé."
      });
    }



    const passwordHash = await bcrypt.hash(password, 10);



    // Création utilisateur
    await pool.query(
      `
      INSERT INTO users 
      (username, password_hash)
      VALUES ($1, $2)
      `,
      [
        username,
        passwordHash
      ]
    );


    return res.status(201).json({
      message: "Compte créé avec succès."
    });



  } catch (error) {

    console.error("Erreur register :", error);

    return res.status(500).json({
      message: "Erreur serveur."
    });

  }
});





// Connexion
router.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;



    if (!username || !password) {
      return res.status(400).json({
        message: "Nom d'utilisateur et mot de passe obligatoires."
      });
    }




    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );



    if (result.rows.length === 0) {

      return res.status(401).json({
        message: "Identifiants incorrects."
      });

    }



    const user = result.rows[0];



    if (user.status !== "active") {

      return res.status(403).json({
        message: "Ce compte n'est pas actif."
      });

    }




    const passwordIsValid = await bcrypt.compare(
      password,
      user.password_hash
    );



    if (!passwordIsValid) {

      return res.status(401).json({
        message: "Identifiants incorrects."
      });

    }




    await pool.query(
      `
      UPDATE users
      SET last_login_at = NOW()
      WHERE id = $1
      `,
      [
        user.id
      ]
    );




    const token = jwt.sign(

      {
        id: user.id,
        username: user.username,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    );





    return res.json({

      message: "Connexion réussie.",

      token,


      user: {

        id: user.id,

        username: user.username,

        reputation_score: user.reputation_score,

        role: user.role

      }

    });



  } catch(error) {


    console.error("Erreur login :", error);


    return res.status(500).json({

      message: "Erreur serveur."

    });


  }

});



module.exports = router;