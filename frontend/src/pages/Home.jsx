import PostCard from "../components/posts/PostCard";

function Home() {

  const posts = [
    {
      id: 1,
      display_name: "Anonyme",
      community_name: "Études",
      content:
        "Je viens de réussir mon examen après plusieurs semaines de travail.",
      comments_count: 24,
      reactions_count: 132
    },
    {
      id: 2,
      display_name: "Anonyme",
      community_name: "Relations",
      content:
        "Parfois il faut juste prendre du recul et penser à soi.",
      comments_count: 8,
      reactions_count: 67
    }
  ];


  function handleReaction(postId, type) {
    console.log(
      "Réaction :",
      type,
      "sur le post",
      postId
    );
  }


  function handleReport(postId) {
    console.log(
      "Signalement du post",
      postId
    );
  }


  return (
    <main>

      <h1>Accueil</h1>

      <button>
        + Nouvelle publication
      </button>


      <section>

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onReaction={handleReaction}
            onReport={handleReport}
          />
        ))}

      </section>

    </main>
  );
}

export default Home;
