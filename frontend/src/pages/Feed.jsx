import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../services/api";

import PostCard from "../components/posts/PostCard";

import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";

import "./Feed.css";


function Feed() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();


  const [user, setUser] = useState(null);

  const [posts, setPosts] = useState([]);

  const [communities, setCommunities] = useState([]);

  const [search, setSearch] = useState(searchParams.get("q") || "");

  const [communityId, setCommunityId] = useState("");

  const [content, setContent] = useState("");

  const [isFullyAnonymous, setIsFullyAnonymous] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  const loadData = async () => {

    try {

      const [
        postsResponse,
        communitiesResponse
      ] = await Promise.all([

        api.get("/posts"),

        api.get("/communities")

      ]);



      setPosts(
        postsResponse.data.posts
      );


      setCommunities(
        communitiesResponse.data.communities
      );



      if (
        communitiesResponse.data.communities.length > 0
        &&
        !communityId
      ) {

        setCommunityId(
          communitiesResponse.data.communities[0].id
        );

      }


    } catch(error) {

      setError(
        "Impossible de charger les données."
      );


    } finally {

      setLoading(false);

    }

  };



  const handleCreatePost = async (event) => {

    event.preventDefault();

    setError("");



    if(!communityId){

      setError(
        "Choisis une communauté."
      );

      return;

    }



    if(!content.trim()){

      setError(
        "Le message ne peut pas être vide."
      );

      return;

    }



    try {


      await api.post("/posts", {

        community_id:Number(communityId),

        content:content.trim(),

        is_fully_anonymous:isFullyAnonymous

      });



      setContent("");

      setIsFullyAnonymous(false);



      await loadData();



    } catch(error){


      setError(
        error.response?.data?.message ||
        "Erreur lors de la publication."
      );


    }

  };
  const handleReaction = async (postId, type) => {

    try {

      await api.post("/reactions/toggle", {

        post_id: postId,

        type

      });


      await loadData();


    } catch(error) {


      setError(
        error.response?.data?.message ||
        "Erreur lors de la réaction."
      );


    }

  };



  const handleReport = async (postId) => {

    const reason = window.prompt(
      "Motif du signalement : spam, insulte, harcelement, menace, arnaque, discours_haineux, contenu_dangereux, autre"
    );


    if(!reason) return;



    try {


      await api.post("/reports", {

        post_id:postId,

        reason,

        details:
          "Signalement envoyé depuis le fil d'actualité."

      });



      alert(
        "Signalement envoyé."
      );


    } catch(error) {


      alert(
        error.response?.data?.message ||
        "Erreur lors du signalement."
      );


    }

  };




  useEffect(() => {


    const token =
      localStorage.getItem(
        "anonyma_token"
      );


    const storedUser =
      localStorage.getItem(
        "anonyma_user"
      );



    if(!token || !storedUser){


      navigate("/login");

      return;


    }



    setUser(
      JSON.parse(storedUser)
    );


    loadData();



  }, []);



  if(loading){

    return (

      <div className="feed-page">

        Chargement...

      </div>

    );

  }

  const filteredPosts = posts.filter((post) => {
    const text = search.toLowerCase();

    return (
      post.content.toLowerCase().includes(text) ||
      post.community_name.toLowerCase().includes(text) ||
      post.display_name.toLowerCase().includes(text)
    );
  });



  return (

    <div className="feed-page">


      <Sidebar user={user} />



      <main className="feed-main">


        <section className="feed-header">

          <h2>
            Fil d'actualité
          </h2>


          <p>
            Exprime-toi librement,
            dans le respect.
          </p>

        </section>



        {error && (

          <div className="feed-error">

            {error}

          </div>

        )}




        <section
          className="create-post-card"
          id="create"
        >


          <h3>
            Créer une publication
          </h3>



          <form
            onSubmit={handleCreatePost}
          >


            <label>
              Communauté
            </label>



            <select

              value={communityId}

              onChange={(event)=>
                setCommunityId(
                  event.target.value
                )
              }

            >


              {communities.map(
                (community)=>(


                  <option

                    key={community.id}

                    value={community.id}

                  >

                    {community.name}


                  </option>


                )

              )}


            </select>
            <label>
              Message
            </label>


            <textarea

              value={content}

              onChange={(event)=>
                setContent(
                  event.target.value
                )
              }

              placeholder="Écris ce que tu souhaites partager..."

            />



            <div className="anonymous-row">


              <input

                type="checkbox"

                checked={isFullyAnonymous}

                onChange={(event)=>
                  setIsFullyAnonymous(
                    event.target.checked
                  )
                }

              />

              <span>
                Afficher comme Anonyme
              </span>


            </div>



            <button type="submit">

              Publier

            </button>



          </form>


        </section>




        <section
          className="posts-list"
          id="feed"
        >

          <input
            type="text"
            className="feed-search-input"
            placeholder="Rechercher une publication, une communauté ou un auteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {
            filteredPosts.length === 0 ? (

              <div className="empty-box">

                Aucune publication pour le moment.

              </div>


            ) : (


              filteredPosts.map((post)=>(


                <PostCard

                  key={post.id}

                  post={post}

                  onReaction={handleReaction}

                  onReport={handleReport}

                />


              ))


            )

          }



        </section>



      </main>



      <RightSidebar communities={communities} />



    </div>


  );

}


export default Feed;