const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


// Récupérer le fil des publications
router.get("/", async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT 
        posts.id,
        posts.content,
        posts.is_fully_anonymous,
        posts.status,
        posts.created_at,
        communities.id AS community_id,
        communities.name AS community_name,
        communities.slug AS community_slug,
        CASE 
          WHEN posts.is_fully_anonymous = true THEN 'Anonyme'
          ELSE users.username
        END AS display_name,
        COUNT(DISTINCT comments.id) AS comments_count,
        COUNT(DISTINCT reactions.id) AS reactions_count

      FROM posts

      JOIN users 
      ON posts.user_id = users.id

      JOIN communities 
      ON posts.community_id = communities.id

      LEFT JOIN comments 
      ON comments.post_id = posts.id 
      AND comments.status = 'visible'

      LEFT JOIN reactions 
      ON reactions.post_id = posts.id

      WHERE posts.status = 'visible'

      GROUP BY 
        posts.id,
        communities.id,
        users.username

      ORDER BY posts.created_at DESC
      `
    );


    return res.json({

      message: "Publications récupérées avec succès.",

      posts: result.rows

    });


  } catch(error) {


    console.error("Erreur posts :", error);


    return res.status(500).json({

      message: "Erreur serveur."

    });


  }

});





// Publications d'une communauté
router.get("/community/:slug", async (req,res)=>{


  try {


    const {slug}=req.params;



    const result = await pool.query(

      `
      SELECT 
        posts.id,
        posts.content,
        posts.is_fully_anonymous,
        posts.status,
        posts.created_at,
        communities.id AS community_id,
        communities.name AS community_name,
        communities.slug AS community_slug,

        CASE 
          WHEN posts.is_fully_anonymous = true THEN 'Anonyme'
          ELSE users.username
        END AS display_name,

        COUNT(DISTINCT comments.id) AS comments_count,
        COUNT(DISTINCT reactions.id) AS reactions_count

      FROM posts

      JOIN users 
      ON posts.user_id = users.id

      JOIN communities
      ON posts.community_id = communities.id

      LEFT JOIN comments
      ON comments.post_id = posts.id
      AND comments.status='visible'

      LEFT JOIN reactions
      ON reactions.post_id = posts.id

      WHERE posts.status='visible'
      AND communities.slug=$1

      GROUP BY posts.id, communities.id, users.username

      ORDER BY posts.created_at DESC
      `,

      [slug]

    );



    return res.json({

      message:"Publications de la communauté récupérées avec succès.",

      posts:result.rows

    });



  }catch(error){

    console.error("Erreur posts community :",error);


    res.status(500).json({

      message:"Erreur serveur."

    });


  }


});






// Créer une publication
router.post("/", authMiddleware, async(req,res)=>{


try{


const {
community_id,
content,
is_fully_anonymous
}=req.body;



if(!community_id || !content){

return res.status(400).json({

message:"La communauté et le contenu sont obligatoires."

});

}



const cleanContent=content.trim();



if(cleanContent.length<3){

return res.status(400).json({

message:"La publication doit contenir au moins 3 caractères."

});

}



const anonymousValue =
is_fully_anonymous === true;



const community =
await pool.query(

"SELECT id FROM communities WHERE id=$1 AND status='active'",

[community_id]

);



if(community.rows.length===0){

return res.status(404).json({

message:"Communauté introuvable."

});

}




const result =
await pool.query(

`
INSERT INTO posts
(user_id,community_id,content,is_fully_anonymous)

VALUES($1,$2,$3,$4)

RETURNING id
`,

[
req.user.id,
community_id,
cleanContent,
anonymousValue
]

);




return res.status(201).json({

message:"Publication créée avec succès.",

post:{

id:result.rows[0].id,
community_id,
content:cleanContent,
is_fully_anonymous:anonymousValue

}

});



}catch(error){


console.error("Erreur create post :",error);


res.status(500).json({

message:"Erreur serveur."

});


}


});





// Mes publications
router.get("/mine",authMiddleware,async(req,res)=>{


try{


const result =
await pool.query(

`
SELECT
posts.id,
posts.content,
posts.is_fully_anonymous,
posts.status,
posts.created_at,
communities.name AS community_name,
communities.slug AS community_slug

FROM posts

JOIN communities
ON posts.community_id=communities.id

WHERE posts.user_id=$1

ORDER BY posts.created_at DESC
`,

[req.user.id]

);



res.json({

message:"Mes publications récupérées avec succès.",

posts:result.rows

});



}catch(error){

console.error(error);

res.status(500).json({

message:"Erreur serveur."

});

}


});





// Détail publication
router.get("/:id",async(req,res)=>{


try{


const result =
await pool.query(

`
SELECT
posts.id,
posts.content,
posts.is_fully_anonymous,
posts.status,
posts.created_at,
communities.id AS community_id,
communities.name AS community_name,
users.username,

CASE
WHEN posts.is_fully_anonymous=true THEN 'Anonyme'
ELSE users.username
END AS display_name

FROM posts

JOIN users
ON posts.user_id=users.id

JOIN communities
ON posts.community_id=communities.id

WHERE posts.id=$1
AND posts.status='visible'
`,

[req.params.id]

);



if(result.rows.length===0){

return res.status(404).json({

message:"Publication introuvable."

});

}



res.json({

message:"Publication récupérée avec succès.",

post:result.rows[0]

});



}catch(error){

console.error(error);

res.status(500).json({

message:"Erreur serveur."

});

}


});






// Supprimer publication
router.delete("/:id",authMiddleware,async(req,res)=>{


try{


const post =
await pool.query(

"SELECT id,user_id FROM posts WHERE id=$1 AND status='visible'",

[req.params.id]

);



if(post.rows.length===0){

return res.status(404).json({

message:"Publication introuvable."

});

}



if(post.rows[0].user_id!==req.user.id){

return res.status(403).json({

message:"Tu ne peux supprimer que tes propres publications."

});

}



await pool.query(

"UPDATE posts SET status='deleted',updated_at=NOW() WHERE id=$1",

[req.params.id]

);



res.json({

message:"Publication supprimée avec succès."

});



}catch(error){

console.error(error);

res.status(500).json({

message:"Erreur serveur."

});

}


});



module.exports = router;