const me = {};

me.serverName = "https://hiking-photos-66kz.onrender.com"; //TODO replace server name
me.sendPostsSuffix = "/api/posts";
me.updatePostsSuffix = "/api/updatePost";
me.deletePostsSuffix = "/api/posts/delete";
me.toPosts = me.serverName + me.sendPostsSuffix;
me.updatePosts = me.serverName + me.updatePostsSuffix;
me.deletePosts = me.serverName + me.deletePostsSuffix;


/* Allows sending a post update. Takes JSON postdata, as well as an optional
react hook to indicate when done.
*/
me.sendPostToServer = (postdata, setTrueWhenDone) => {
  fetch(me.toPosts, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postdata),
  }).then({
    if(setTrueWhenDone) {
      setTrueWhenDone(true);
    },
  });
};

me.getPostsForUser = async (username) => {
  // console.log("Connector getting posts for",username)
  // console.log("url","/api/posts?" + new URLSearchParams({"user":username}))
  const res = await fetch(
    me.serverName + "/api/posts?" + new URLSearchParams({ user: username })
  );
  if (!res.ok) {
    console.error("Failed to fetch posts");
  }
  const data = await res.json();
  return data;
};

me.getURLforMap = (user, percent1, percent2) => {
  const url =
    me.serverName +
    "/api/pic?" +
    new URLSearchParams({ user: user, p1: percent1, p2: percent2 });
  return url;
};

me.updatePost = (postdata) => {
  fetch(me.updatePosts, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postdata),
  });
};
me.deletePost = (id) => {
  const data = { id: id };
  fetch(me.deletePosts, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export default me;
