import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/dashboardHeader";
import { Like } from "../store/slices/user";
import "../styles/pages/post.scss";

const post = () => {
  const { id } = useParams();
  const [visibility, setDisplay] = useState("visible");
  const [postData, setPostData] = useState({});
  const dispatch = useDispatch();
  let plike = useSelector((s) => s.userDatas.like);
  const [comments, setComments] = useState([]);
  const [tdiscussion, setTdiscussion] = useState({});
  const [postValue, setpostValue] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    (async function fetchPost() {
      try {
        const { data } = await axios.get(`/posts/${id}`);
        setPostData(data);
        setComments(data.comments || []);
      } catch (err) {
        // Error handled silently
      }
    })();
    (async function me() {
      try {
        const { data } = await axios.get("/profile/me");
        setCurrentUserId(data?.user?._id || "");
      } catch (e) {
        // ignore
      }
    })();
  }, [id]);

  async function like() {
    try {
      let data = await axios.put(`/posts/like/${id}`);
      toast("Post liked!", { type: "success" });
      dispatch(Like(data.data));
    } catch (err) {
      toast("Post already liked", { type: "error" });
    }
  }
  async function dislike() {
    try {
      let data = await axios.put(`/posts/unlike/${id}`);
      dispatch(Like(data.data));
      toast("Post unliked!", { type: "success" });
    } catch (err) {
      toast("Post already unliked", { type: "error" });
    }
  }
  // message: onchange
  function onchange(e) {
    setpostValue(e.target.value);
  }

  // crete post
  async function createDiscussion(e) {
    e.preventDefault();
    e.target.reset();
    if (!postValue.trim()) {
      toast("Comment text is required", { type: "error" });
      return;
    }
    try {
      const { data } = await axios.post(`/posts/comment/${postData?._id}`, {
        text: postValue,
      });
      setComments((prev) => [data, ...prev]);
    } catch (err) {
      toast("Failed to create comment", { type: "error" });
    }
  }

  async function deletePost() {
    try {
      await axios.delete(`/posts/${id}`);
      toast("Post deleted", { type: "success" });
      window.history.back();
    } catch (err) {
      toast("Unable to delete post", { type: "error" });
    }
  }

  async function deleteComment(commentId) {
    try {
      await axios.delete(`/posts/comment/${id}/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast("Comment deleted", { type: "success" });
    } catch (err) {
      toast("Unable to delete comment", { type: "error" });
    }
  }

  return (
    <div>
      <Header />
      <div className="post_detail_container">
        {/* button backto posts */}
        <div className="backtopostsDiv">
          <Link to="/posts" className="btn_back">
            <i class="bx bx-arrow-back"></i>
            Back to posts
          </Link>
        </div>

        {/* comments */}

        <div className="userposts">
          <Link
            to={`/profile/${postData.user}`}
            className="linktoprofile"
          >
            <div className="img_name">
              <img src={postData.avatar} alt="" />
              <p>{postData.name}</p>
            </div>
          </Link>

          <div className="postnameandlikes">
            <div className="post_name">
              <h2>{postData.text}</h2>
            </div>
            <br />
            <div className="post_date">Posted on {postData.date}</div>
            <br />
            <br />
            <div className="btns">
              <div className="like" onClick={like}>
                <i className="bx bxs-like"></i>
                {/* <span>{postData.likes?.length}</span> */}
                {plike.length === 0 ? (
                  <span>{postData.likes?.length}</span>
                ) : (
                  <span>{plike[0]?.length}</span>
                )}
              </div>
              <div className="dislike" onClick={dislike}>
                <i className="bx bxs-dislike"></i>
                <span></span>
              </div>
              <Link
                to={`/posts/${postData._id}`}
                className="linktodiscussion"
              >
                <div className="discussion">
                  Discussion{" "}
                  <span style={{ visibility: visibility }}>
                    {postData.comments?.length}
                  </span>
                </div>
              </Link>
              {currentUserId && postData.user === currentUserId && (
                <div className="removepost" onClick={deletePost}>
                  <i className="bx bx-x"></i>
                </div>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="texts">
          <h2 className="text_saysomething">Leave a Comment</h2>
          <br />
          <form className="form" onSubmit={createDiscussion}>
            <textarea
              className="textarea"
              name="text"
              id="text"
              cols="50"
              rows="4"
              onChange={onchange}
              placeholder="Comment the post"
            ></textarea>
            <br />
            <br />
            <button className="button">Submit</button>
          </form>
        </div>

        {/* comments */}

        {comments.map((c, index) => (
          <div className="userposts" key={index}>
            <Link to={`/profile/${c.user}`} className="linktoprofile">
              <div className="img_name">
                <img src={c.avatar} alt="" />
                <p>{c.name}</p>
              </div>
            </Link>
            <div className="postnameandlikes">
              <div className="post_name">
                <h2>{c.text}</h2>
              </div>
              <br />
              <div className="post_date">Posted on {c.date}</div>
              <br />
              {currentUserId && c.user === currentUserId && (
                <div
                  className="removepost"
                  onClick={() => deleteComment(c._id)}
                >
                  <i className="bx bx-x"></i>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default post;
