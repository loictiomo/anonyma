import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./RightSidebar.css";


function RightSidebar({ communities: communitiesProp }) {

  const [fetchedCommunities, setFetchedCommunities] = useState([]);

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("anonyma_user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (communitiesProp) return;

    const loadCommunities = async () => {
      try {
        const res = await api.get("/communities");
        setFetchedCommunities(res.data.communities);
      } catch {
        setFetchedCommunities([]);
      }
    };

    loadCommunities();
  }, [communitiesProp]);

  const communities = communitiesProp || fetchedCommunities;

  return (
    <aside className="right-sidebar">

      <section className="right-user-box">
        <h3>@{storedUser?.username || "Utilisateur"}</h3>
        <span>{storedUser?.role || "user"}</span>
      </section>


      <section className="communities-panel">

        <h2>
          <Users size={22}/>
          Communautés
        </h2>


        <p>
          Rejoins des espaces de discussion
          selon tes centres d'intérêt.
        </p>


        {communities.length === 0 ? (

          <div className="empty-community">
            Aucune communauté disponible.
          </div>

        ) : (

          <div className="right-community-list">

            {communities.map((community) => (

              <Link
                key={community.id}
                to={`/communities/${community.slug}`}
                className="right-community-card"
              >

                <h4>
                  {community.name}
                </h4>

                <p>
                  {community.description}
                </p>

              </Link>

            ))}

          </div>

        )}

      </section>


    </aside>
  );
}


export default RightSidebar;