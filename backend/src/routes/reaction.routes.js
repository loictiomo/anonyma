const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


// Ajouter ou retirer une réaction
router.post("/toggle", authMiddleware, async (req, res) => {

  try {

    const { post_id, type } = req.body;


    if (!post_id) {

      return res.status(400).json({

        message: "La publication est obligatoire."

      });

    }



    const reactionType = type || "like";


    const allowedTypes = [
      "like",
      "support",
      "interesting"
    ];



    if (!allowedTypes.includes(reactionType)) {

      return res.status(400).json({

        message: "Type de réaction invalide."

      });

    }





    const post = await pool.query(

      "SELECT id FROM posts WHERE id=$1 AND status='visible'",

      [post_id]

    );



    if(post.rows.length===0){

      return res.status(404).json({

        message:"Publication introuvable."

      });

    }







    const existing = await pool.query(

      `
      SELECT id,type 
      FROM reactions
      WHERE user_id=$1
      AND post_id=$2
      `,

      [
        req.user.id,
        post_id
      ]

    );





    if(existing.rows.length>0){


      const reaction = existing.rows[0];



      // Retirer la réaction
      if(reaction.type===reactionType){


        await pool.query(

          "DELETE FROM reactions WHERE id=$1",

          [reaction.id]

        );



        return res.json({

          message:"Réaction retirée.",

          reacted:false

        });


      }




      // Modifier la réaction

      await pool.query(

        `
        UPDATE reactions
        SET type=$1
        WHERE id=$2
        `,

        [
          reactionType,
          reaction.id
        ]

      );



      return res.json({

        message:"Réaction modifiée.",

        reacted:true,

        type:reactionType

      });


    }







    // Nouvelle réaction

    await pool.query(

      `
      INSERT INTO reactions
      (user_id,post_id,type)

      VALUES($1,$2,$3)
      `,

      [
        req.user.id,
        post_id,
        reactionType
      ]

    );





    return res.status(201).json({

      message:"Réaction ajoutée.",

      reacted:true,

      type:reactionType

    });




  }catch(error){


    console.error("Erreur toggle reaction :",error);


    return res.status(500).json({

      message:"Erreur serveur."

    });


  }


});









// Récupérer les réactions d'une publication
router.get("/post/:postId", async(req,res)=>{


try{


const result = await pool.query(

`
SELECT

type,

COUNT(*) AS total


FROM reactions


WHERE post_id=$1


GROUP BY type

`,

[req.params.postId]

);



res.json({

message:"Réactions récupérées avec succès.",

reactions:result.rows

});



}catch(error){


console.error("Erreur get reactions :",error);


res.status(500).json({

message:"Erreur serveur."

});


}


});



module.exports = router;