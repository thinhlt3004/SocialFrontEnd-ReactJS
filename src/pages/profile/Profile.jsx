import "./profile.css";
import Topbar from "./../../components/topbar/Topbar";
import Feed from "./../../components/feed/Feed";
import Rightbar from "./../../components/rightbar/Rightbar";
import Sidebar from "./../../components/sidebar/Sidebar";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import {useSelector, useDispatch} from 'react-redux';
import * as authActions from './../../redux/actions/authActions';
export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  let params_username = useParams();
  const [user, setUser] = useState({});
  const search = useLocation().search;

  const postId = new URLSearchParams(search).get("postId");

  const [fileAvatar, setFileAvatar] = useState(null);
  const [fileCover, setFileCover] = useState(null);
  //------------------------------------
  const socket = useRef();
  const [getnewMessage, setNewMessage] = useState(null);
  const [getCallBackComment, setGetCallBackComment] = useState(null);
  const [newrequestedFriend, setNewRequestedFriend] = useState(null);
  const [getInfoRequestedFriend, setGetInfoRequestedFriend] = useState([]);
  const [getAcceptCancel, setGetAcceptCancel] = useState({});
  const [getStatus, setGetStatus] = useState(null);
  const [getAccept, setGetAccept] = useState(null);
  const currentUser = useSelector((state) => state.auth).data;
  const dispatch = useDispatch();
  useEffect(() => {
    socket.current = io("ws://localhost:8989");
    socket.current.on("CallbackMessagetoAllClient", (data) => {
      if (data.isLiked !== null) {
        if (data.notification !== null) {
          setGetCallBackComment({
            senderId: data.senderId,
            postId: data.postId,
            comments: data.comments,
            content: data.content,
            notification: data.notification,
            isLiked: data.isLiked,
          });
        } else {
          setGetCallBackComment({
            senderId: data.senderId,
            postId: data.postId,
            comments: data.comments,
            content: data.content,
            isLiked: data.isLiked,
          });
        }
      } else {
        setGetCallBackComment({
          senderId: data.senderId,
          postId: data.postId,
          comments: data.comments,
          content: data.content,
          notification: data.notification,
        });
      }
    });
    socket.current.on("SendRequestFriendCallback", (data) => {
      if (data.receiverId === currentUser._id) {
        setGetInfoRequestedFriend({
          _id: data._id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          createdAt: data.createdAt,
          status: data.status,
        });
      }
    });

    socket.current.on("SendCallBackAcceptOrCancel", (data) => {
      if (data.senderId === currentUser._id) {
        setGetAcceptCancel({
          _id: data._id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          createdAt: data.createdAt,
          status: data.status,
        });
      }
      if(data.receiverId === currentUser._id){
        setGetAccept({
            id: data._id,
        })
      }

    });
  }, [currentUser?._id]);


  useEffect(() => {
    if (getStatus) {
      socket.current.emit("AcceptOrCancel", getStatus);
    }
  }, [getStatus]);
  //Send new Friend Requested
  useEffect(() => {
    if (newrequestedFriend) {
      socket.current.emit("SendFriendRequest", newrequestedFriend);
    }
  }, [newrequestedFriend]);
  useEffect(() => {
    if (getnewMessage !== null) {
      socket.current.emit("SendnewComment", getnewMessage);
    }
  }, [getnewMessage]);
  //------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `/users?username=${params_username.username}`
      );
      setUser(res.data);
    };
    fetchData();
  }, [params_username.username]);
  useEffect(() => {
    const UpdateCover = async () => {
      if (fileCover) {
        const data = new FormData();
        data.append("file", fileCover);
        data.append("name", fileCover.name);
        try {
          await axios.post("/uploads/person", data);
        } catch (e) {
          console.log(e);
        }

        const newCover = {
          img: `/person/` + fileCover.name,
        };
        // console.log(currentUser._id);
        // console.log(fileCover.name)
        setUser({ ...user, coverPicture: `/person/` + fileCover.name });
        try {
          const res = await axios.put(
            `/users/${currentUser._id}/coverPicture`,
            newCover
          );
          console.log(res.data);
          setFileCover(null);
        } catch (error) {
          console.log(error);
        }
      }
    };
    UpdateCover();
  }, [fileCover, currentUser?._id, user]);

  useEffect(() => {
    const UpdateAvatar = async () => {
      if (fileAvatar && user !== null) {
        const data = new FormData();
        data.append("file", fileAvatar);
        data.append("name", fileAvatar.name);
        try {
          await axios.post("/uploads/person", data);
        } catch (e) {
          console.log(e);
        }

        const newAvatar = {
          img: `/person/` + fileAvatar.name,
        };
        setUser({ ...user, profilePicture: `/person/` + fileAvatar.name });
        dispatch(authActions.getUser.getUserSuccess(user));
        try {
          const res = await axios.put(
            `/users/${currentUser._id}/profilePicture`,
            newAvatar
          );
          console.log(res.data);
          setFileAvatar(null);
        } catch (error) {
          console.log(error);
        }
      }
    };
    UpdateAvatar();
  }, [fileAvatar, currentUser?._id, user, dispatch]);

  if(user === undefined && !currentUser) return null;
  return (
    <>
      <Topbar
        setNewRequestedFriend={setNewRequestedFriend}
        getInfoRequestedFriend={getInfoRequestedFriend}
        getCallBackComment={getCallBackComment}
        getAccept={getAccept}
      />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "/person/default_cover.jpeg"
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user !== undefined && user.profilePicture !== null && user.profilePicture !== ""
                    ? PF + user?.profilePicture
                    : PF + "/person/default.jpeg"
                }
                alt=""
              />
              {currentUser?._id === user?._id ? (
                <label htmlFor="fileCoverPic" className="fileCover">
                  <CameraAltIcon />
                  <input
                    type="file"
                    id="fileCoverPic"
                    style={{ display: "none" }}
                    onChange={(e) => setFileCover(e.target.files[0])}
                  />
                  <span className="TextCoverPicture">Change cover picture</span>
                </label>
              ) : (
                ""
              )}
              {currentUser?._id === user?._id ? (
                <label htmlFor="fileAvatar" className="fileAvatar">
                  <CameraAltIcon />
                  <input
                    type="file"
                    id="fileAvatar"
                    style={{ display: "none" }}
                    onChange={(e) => setFileAvatar(e.target.files[0])}
                  />
                </label>
              ) : (
                ""
              )}
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed
              getCallBackComment={getCallBackComment}
              setNewMessage={setNewMessage}
              postId={postId}
              profile={true}
              username={params_username.username}
            />
            <Rightbar
              setGetAccept={setGetAccept}
              setGetStatus={setGetStatus}
              getAcceptCancel={getAcceptCancel}
              setNewRequestedFriend={setNewRequestedFriend}
              user={user}
            />
          </div>
        </div>
      </div>
    </>
  );
}
