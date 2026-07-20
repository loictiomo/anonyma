const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


// Récupérer les commentaires d'une publication
router.get("/post/:postId", async (req, res) => {

  try {

    const { postId } = req.params;


    const result = await pool.query(
      `
      SELECT 
        comments.id,
        comments.post_id,
        comments.content,
        comments.is_fully_anonymous,
        comments.status,
        comments.created_at,

        CASE
          WHEN comments.is_fully_anonymous = true THEN 'Anonyme'
          ELSE users.username
        END AS display_name

      FROM comments

      JOIN users
      ON comments.user_id = users.id

      WHERE comments.post_id = $1
      AND comments.status = 'visible'

      ORDER BY comments.created_at ASC
      `,
      [
        postId
      ]
    );


    return res.json({

      message: "Commentaires récupérés avec succès.",

      comments: result.rows

    });


  } catch(error) {


    console.error("Erreur get comments :", error);


    return res.status(500).json({

      message:"Erreur serveur."

    });


  }

});





// Créer un commentaire
router.post("/", authMiddleware, async(req,res)=>{


try{


const {
post_id,
content,
is_fully_anonymous
}=req.body;



if(!post_id || !content){

return res.status(400).json({

message:"La publication et le contenu sont obligatoires."

});

}



const cleanContent = content.trim();



if(cleanContent.length < 2){

return res.status(400).json({

message:"Le commentaire doit contenir au moins 2 caractères."

});

}



if(cleanContent.length > 1000){

return res.status(400).json({

message:"Le commentaire ne doit pas dépasser 1000 caractères."

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




const anonymousValue =
is_fully_anonymous !== false;



const result = await pool.query(

`
INSERT INTO comments
(post_id,user_id,content,is_fully_anonymous)

VALUES($1,$2,$3,$4)

RETURNING id
`,

[
post_id,
req.user.id,
cleanContent,
anonymousValue
]

);





return res.status(201).json({

message:"Commentaire créé avec succès.",

comment:{

id:result.rows[0].id,

post_id,

content:cleanContent,

is_fully_anonymous:anonymousValue

}

});




}catch(error){


console.error("Erreur create comment :",error);


return res.status(500).json({

message:"Erreur serveur."

});


}


});






// Mes commentaires
router.get("/mine", authMiddleware, async(req,res)=>{


try{


const result = await pool.query(

`
SELECT

comments.id,

comments.post_id,

comments.content,

comments.is_fully_anonymous,

comments.status,

comments.created_at,

posts.content AS post_content,

communities.name AS community_name,

communities.slug AS community_slug


FROM comments


JOIN posts
ON comments.post_id=posts.id


JOIN communities
ON posts.community_id=communities.id


WHERE comments.user_id=$1


ORDER BY comments.created_at DESC

`,

[req.user.id]

);



res.json({

message:"Mes commentaires récupérés avec succès.",

comments:result.rows

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Erreur serveur."

});


}


});







// Supprimer son commentaire
router.delete("/:id",authMiddleware,async(req,res)=>{


try{


const comment = await pool.query(

"SELECT id,user_id FROM comments WHERE id=$1 AND status='visible'",

[req.params.id]

);



if(comment.rows.length===0){

return res.status(404).json({

message:"Commentaire introuvable."

});

}




if(comment.rows[0].user_id!==req.user.id){

return res.status(403).json({

message:"Tu ne peux supprimer que tes propres commentaires."

});

}




await pool.query(

"UPDATE comments SET status='deleted' WHERE id=$1",

[req.params.id]

);



res.json({

message:"Commentaire supprimé avec succès."

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Erreur serveur."

});


}


});



module.exports = router;