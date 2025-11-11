const me = {}

me.serverName = "http://localhost:3000";
me.postUpdateEndpoint = "/api/posts";
me.toPosts = me.serverName + me.postUpdateEndpoint;

/* Allows sending a post update. Takes JSON postdata, as well as an optional
react hook to indicate when done.
*/
me.sendPostToServer = (postdata,setTrueWhenDone) => {
    fetch(me.toPosts, {
        method: 'POST',
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify(postdata)
    }).then({
        if (setTrueWhenDone){
            setTrueWhenDone(true);
        }
    })
}

me.getPostsForUser = async (username) => {
    // console.log("Connector getting posts for",username)
    // console.log("url","/api/posts?" + new URLSearchParams({"user":username}))
    const res = await fetch(me.serverName + "/api/posts?" + new URLSearchParams({"user":username}));
    if (!res.ok){
        console.error("Failed to fetch posts");
    }
    const data = await res.json();
    return data;
}

me.getURLforMap = (user,percent1,percent2) => {
    const url = me.serverName + "/api/pic?" + new URLSearchParams({"user":user,"p1":percent1,"p2":percent2});
    return url
}


export default me;