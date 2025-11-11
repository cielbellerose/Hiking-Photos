import {Link} from "react-router-dom"

export default function Post({post}){

    return(
    <div style={{"display":"flex"}} className="post">
        <Link state={post} to={{pathname:"/view"}} className="post-title">{post.title}</Link>
        <div className="post-edit">Edit</div>
        <div className="post-delete">Delete</div>
    </div>
    );
}