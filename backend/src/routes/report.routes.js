const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


// Signaler une publication ou un commentaire
router.post("/", authMiddleware, async (req, res) => {

  try {

    const {
      post_id,
      comment_id,
      reason,
      details
    } = req.body;



    if (!post_id && !comment_id) {

      return res.status(400).json({

        message:"Tu dois signaler une publication ou un commentaire."

      });

    }



    if (!reason) {

      return res.status(400).json({

        message:"Le motif du signalement est obligatoire."

      });

    }




    const allowedReasons = [

      "harcelement",
      "insulte",
      "menace",
      "spam",
      "arnaque",
      "discours_haineux",
      "contenu_dangereux",
      "autre"

    ];




    if(!allowedReasons.includes(reason)){


      return res.status(400).json({

        message:"Motif de signalement invalide."

      });


    }





    if(post_id){


      const post = await pool.query(

        `
        SELECT id
        FROM posts
        WHERE id=$1
        AND status='visible'
        `,

        [post_id]

      );



      if(post.rows.length===0){

        return res.status(404).json({

          message:"Publication introuvable."

        });

      }

    }







    if(comment_id){


      const comment = await pool.query(

        `
        SELECT id
        FROM comments
        WHERE id=$1
        AND status='visible'
        `,

        [comment_id]

      );



      if(comment.rows.length===0){

        return res.status(404).json({

          message:"Commentaire introuvable."

        });

      }


    }







    await pool.query(

      `
      INSERT INTO reports
      (
        reporter_id,
        post_id,
        comment_id,
        reason,
        details
      )

      VALUES($1,$2,$3,$4,$5)

      `,

      [

        req.user.id,

        post_id || null,

        comment_id || null,

        reason,

        details || null

      ]

    );





    return res.status(201).json({

      message:"Signalement envoyé avec succès."

    });





  }catch(error){


    console.error("Erreur create report :",error);


    return res.status(500).json({

      message:"Erreur serveur."

    });


  }


});



module.exports = router;