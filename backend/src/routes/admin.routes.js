const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();


router.use(authMiddleware);
router.use(adminMiddleware);



// Tableau de bord administrateur
router.get("/dashboard", async (req, res) => {

  try {

    const usersCount = await pool.query(
      "SELECT COUNT(*) FROM users"
    );

    const postsCount = await pool.query(
      "SELECT COUNT(*) FROM posts"
    );

    const commentsCount = await pool.query(
      "SELECT COUNT(*) FROM comments"
    );

    const reportsCount = await pool.query(
      `
      SELECT COUNT(*)
      FROM reports
      WHERE status = 'pending'
      `
    );

    const communitiesCount = await pool.query(
      `
      SELECT COUNT(*)
      FROM communities
      WHERE status='active'
      `
    );



    return res.json({

      message:"Tableau de bord admin récupéré avec succès.",

      stats:{

        users:Number(usersCount.rows[0].count),

        posts:Number(postsCount.rows[0].count),

        comments:Number(commentsCount.rows[0].count),

        pending_reports:Number(reportsCount.rows[0].count),

        communities:Number(communitiesCount.rows[0].count)

      }

    });



  }catch(error){

    console.error("Erreur admin dashboard :",error);

    res.status(500).json({

      message:"Erreur serveur."

    });

  }

});







// Liste des utilisateurs
router.get("/users", async(req,res)=>{


try{


const result = await pool.query(

`
SELECT

id,
username,
reputation_score,
status,
role,
created_at,
last_login_at

FROM users

ORDER BY created_at DESC
`

);



res.json({

message:"Utilisateurs récupérés avec succès.",

users:result.rows

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Erreur serveur."

});


}


});








// Modifier statut utilisateur
router.patch("/users/:id/status",async(req,res)=>{


try{


const {status}=req.body;


const allowed=[

"active",
"suspended",
"banned"

];



if(!allowed.includes(status)){


return res.status(400).json({

message:"Statut invalide."

});


}



if(Number(req.params.id)===req.admin.id){

return res.status(400).json({

message:"Tu ne peux pas modifier ton propre statut."

});

}





const user = await pool.query(

"SELECT id FROM users WHERE id=$1",

[req.params.id]

);



if(user.rows.length===0){

return res.status(404).json({

message:"Utilisateur introuvable."

});

}




await pool.query(

"UPDATE users SET status=$1 WHERE id=$2",

[
status,
req.params.id
]

);



res.json({

message:"Statut utilisateur mis à jour avec succès."

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Erreur serveur."

});


}


});









// Modifier rôle utilisateur
router.patch("/users/:id/role",async(req,res)=>{


try{


const {role}=req.body;



const allowed=[

"user",
"moderator",
"admin"

];



if(!allowed.includes(role)){


return res.status(400).json({

message:"Rôle invalide."

});


}




if(Number(req.params.id)===req.admin.id){


return res.status(400).json({

message:"Tu ne peux pas modifier ton propre rôle."

});


}




await pool.query(

"UPDATE users SET role=$1 WHERE id=$2",

[
role,
req.params.id
]

);



res.json({

message:"Rôle utilisateur mis à jour avec succès."

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Erreur serveur."

});


}


});










// Liste des publications
router.get("/posts",async(req,res)=>{


try{


const result = await pool.query(

`
SELECT

posts.id,
posts.content,
posts.status,
posts.is_fully_anonymous,
posts.created_at,

users.username,

communities.name AS community_name


FROM posts


JOIN users
ON posts.user_id=users.id


JOIN communities
ON posts.community_id=communities.id


ORDER BY posts.created_at DESC

`

);



res.json({

message:"Publications récupérées avec succès.",

posts:result.rows

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Erreur serveur."

});


}


});








// Modifier statut publication
router.patch("/posts/:id/status",async(req,res)=>{


try{


const allowed=[

"visible",
"hidden",
"deleted"

];



const {status}=req.body;



if(!allowed.includes(status)){


return res.status(400).json({

message:"Statut invalide."

});


}



await pool.query(

`
UPDATE posts

SET status=$1,
updated_at=NOW()

WHERE id=$2
`,

[
status,
req.params.id
]

);



res.json({

message:"Statut publication mis à jour avec succès."

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Erreur serveur."

});


}


});








// Liste des commentaires
router.get("/comments",async(req,res)=>{


try{


const result = await pool.query(

`
SELECT

comments.id,
comments.post_id,
comments.content,
comments.status,
comments.is_fully_anonymous,
comments.created_at,

users.username


FROM comments


JOIN users
ON comments.user_id=users.id


ORDER BY comments.created_at DESC

`

);



res.json({

message:"Commentaires récupérés avec succès.",

comments:result.rows

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Erreur serveur."

});


}


});








// Modifier statut commentaire
router.patch("/comments/:id/status",async(req,res)=>{


try{


await pool.query(

`
UPDATE comments

SET status=$1

WHERE id=$2

`,

[
req.body.status,
req.params.id
]

);



res.json({

message:"Statut commentaire mis à jour avec succès."

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Erreur serveur."

});


}


});








// Liste des signalements
router.get("/reports",async(req,res)=>{


try{


let query = `

SELECT

reports.id,

reports.reason,

reports.details,

reports.status,

reports.created_at,


reporter.username AS reporter_username,


posts.content AS post_content,


comments.content AS comment_content


FROM reports


JOIN users reporter

ON reports.reporter_id=reporter.id


LEFT JOIN posts

ON reports.post_id=posts.id


LEFT JOIN comments

ON reports.comment_id=comments.id

`;



const params=[];



if(req.query.status){

query += " WHERE reports.status=$1";

params.push(req.query.status);

}



query += " ORDER BY reports.created_at DESC";



const result = await pool.query(

query,

params

);



res.json({

message:"Signalements récupérés avec succès.",

reports:result.rows

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Erreur serveur."

});


}


});








// Modifier statut signalement
router.patch("/reports/:id/status",async(req,res)=>{


try{


const allowed=[

"pending",
"reviewed",
"dismissed"

];



if(!allowed.includes(req.body.status)){


return res.status(400).json({

message:"Statut invalide."

});


}




await pool.query(

`
UPDATE reports

SET status=$1

WHERE id=$2

`,

[

req.body.status,

req.params.id

]

);



res.json({

message:"Signalement mis à jour avec succès."

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Erreur serveur."

});


}


});



module.exports = router;