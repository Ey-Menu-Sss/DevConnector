import axios, { all } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/dashboardHeader";
import { PostsLike, Allposts } from "../store/slices/user";
import "../styles/pages/_posts.scss";
import { PostSkeleton } from "../components/LoadingSkeleton";

const posts = () => {
  const [postData, setPostData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [postValue, setpostValue] = useState("");
  const [createpost, setCreatepost] = useState({});
  const [rlike , setRLike] = useState(true)
  const [rdislike , setRdisLike] = useState(true)
  const [currentUserId, setCurrentUserId] = useState("")

  if (!localStorage.getItem("token")) {
    useEffect(() => navigate("/login"), []);
  }

  useEffect(() => {
    (async function posts() {
      try {
        let data = await axios.get("/posts");
        axios.defaults.headers.common["x-auth-token"] =
        localStorage.getItem("token");
        setPostData(data.data);
        } catch (err) {
          toast("Failed to load posts", { type: "error" });
      }
    })();
    (async function me(){
      try{
        const { data } = await axios.get('/profile/me')
        setCurrentUserId(data?.user?._id || "")
      }catch(e){
        // ignore
      }
    })();
  }, [createpost, rlike, rdislike]);
  async function like(id) {
    try {
      let data = await axios.put(`/posts/like/${id}`);
      toast("Post liked!", { type: "success" });
      setRLike(data.data)
    } catch (err) {
      toast("Post already liked", { type: "error" });
    }
  }
  async function dislike(id) {
    try {
      let data = await axios.put(`/posts/unlike/${id}`);
      toast("Post unliked!", { type: "success" });
      setRdisLike(data.data)
    } catch (err) {
      toast("Post already unliked", { type: "error" });
    }
  }

  // message: onchange
  function onchange(e) {
    setpostValue(e.target.value);
  }

  // crete post
  async function createPost(e) {
    e.preventDefault();
    e.target.reset();
    if(!postValue.trim()){
      toast("Post text is required", { type: "error" })
      return;
    }
    let data = await axios.post("/posts", { text: postValue });
    setCreatepost(data.data);
  }
  async function deletePost(id){
    try{
      await axios.delete(`/posts/${id}`)
      setPostData((prev)=> prev.filter(p => p._id !== id))
      toast("Post deleted", {type: 'success'})
    }catch(err){
      toast("Unable to delete post", {type: 'error'})
    }
  }
  localStorage.setItem("myposts", JSON.stringify(createpost));

  return (
    <div>
      <Header />
      <div className="posts_container">
        <div className="texts">
          <h1>Posts</h1>
          <div className="info">
            <i className="bx bxs-user"></i>
            <h2>Welcome to the community</h2>
          </div>
        </div>
        <br />
        <h2 className="text_saysomething">Say Something...</h2>
        <br />
        <form className="form" onSubmit={createPost}>
          <textarea
            className="textarea"
            name="text"
            id="text"
            cols="50"
            rows="4"
            onChange={onchange}
            placeholder="Create a post"
          ></textarea>
          <br />
          <br />
          <button className="button" type="submit">
            Submit
          </button>
        </form>
        <br />

        {Object.keys(postData).length === 0 ? (
          <PostSkeleton count={3} />
        ) : (
          postData.map((p, index) => (
            <div className="userposts" key={index}>
              <Link to={`/profile/${p.user}`} className="linktoprofile">
                <div className="img_name">
                  <img src={p.avatar} alt="" />
                  <p>{p.name}</p>
                </div>
              </Link>

              <div className="postnameandlikes">
                <div className="post_name">
                  <h2>{p.text}</h2>
                </div>
                <br />
                <div className="post_date">Posted on {p.date}</div>
                <br />
                <br />
                <div className="btns">
                  <div className="like" onClick={() => like(p._id)}>
                    <i className="bx bxs-like"></i>
                    <span>{p.likes.length}</span>
                  </div>
                  <div
                    className="dislike"
                    onClick={() => dislike(p._id)}
                  >
                    <i className="bx bxs-dislike"></i>
                    <span></span>
                  </div>
                  <Link
                    to={`/posts/${p._id}`}
                    className="linktodiscussion"
                  >
                    <div className="discussion">
                      Discussion{" "}
                      {p.comments && p.comments > 0 && (
                        <span>{p.comments}</span>
                      )}
                    </div>
                  </Link>
                  {currentUserId && p.user === currentUserId && (
                    <div className="removepost" onClick={()=>deletePost(p._id)}>
                      <i className='bx bx-x' ></i>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default posts;

{
  /* <div className={styles.removepost}>
<i className='bx bx-x' ></i>
</div> */
}
