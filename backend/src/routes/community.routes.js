const express = require("express");
const pool = require("../config/db");

const router = express.Router();


// Récupérer toutes les communautés
router.get("/", async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT 
        id,
        name,
        slug,
        description,
        rules,
        status,
        created_at
      FROM communities
      WHERE status = 'active'
      ORDER BY name ASC
      `
    );


    return res.json({

      message: "Communautés récupérées avec succès.",

      communities: result.rows

    });


  } catch (error) {


    console.error("Erreur communities :", error);


    return res.status(500).json({

      message: "Erreur serveur."

    });


  }

});





// Récupérer une communauté par son slug
router.get("/:slug", async (req, res) => {


  try {


    const { slug } = req.params;



    const result = await pool.query(

      `
      SELECT 
        id,
        name,
        slug,
        description,
        rules,
        status,
        created_at
      FROM communities
      WHERE slug = $1 
      AND status = 'active'
      `,

      [
        slug
      ]

    );




    if (result.rows.length === 0) {


      return res.status(404).json({

        message: "Communauté introuvable."

      });


    }





    return res.json({


      message: "Communauté récupérée avec succès.",


      community: result.rows[0]


    });




  } catch(error) {


    console.error("Erreur community detail :", error);



    return res.status(500).json({


      message: "Erreur serveur."


    });



  }


});



module.exports = router;