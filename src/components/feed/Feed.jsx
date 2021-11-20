import "./feed.css";
import Share from "./../share/Share";
import Post from "./../post/Post";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
export default function Feed({
  username,
  postId,
  setNewMessage,
  getCallBackComment,
}) {
  const [posts, setPosts] = useState([]);
  const [postOne, setPostOne] = useState(null);
  const {data} = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchData = async () => {
        try {
          const res = username
            ? await axios.get(`/posts/profile/${username}`)
            : await axios.get(`/posts/timeline/${data._id}`);
          // setPosts(
          //   res.data.sort((p1, p2) => {
          //     return new Date(p2.createdAt) - new Date(p1.createdAt);
          //   })
          // );
          setPosts(res.data);
        } catch (error) {
          console.log(error.message);
        }
        //console.log(res.data);
    };
    fetchData();
  }, [username, data]);

  useEffect(() => {
    const fetchOnePost = async () => {
      if (postId !== undefined && postId !== null) {
        try {
          const res = await axios.get(`/posts/${postId}`);
          // console.log(res.data);
          setPostOne(res.data);
        } catch (e) {
          console.log(e);
        }
      }
    };
    fetchOnePost();
  }, [postId]);

  if (!data) return null;
  return (
    <div className="feed">
      <div className="feedWrapper">
        {!username  || username === data.username ? <Share /> : ""}
        {postOne ? (
          <Post
            getCallBackComment={getCallBackComment}
            setNewMessage={setNewMessage}
            post={postOne}
          />
        ) : (
          <>
            {posts.map((i) => (
              <Post
                setPosts={setPosts}
                getCallBackComment={getCallBackComment}
                setNewMessage={setNewMessage}
                key={i._id}
                post={i}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
