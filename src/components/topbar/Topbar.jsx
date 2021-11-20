import "./topbar.css";
import {
  Search,
  Person,
  Chat,
  Notifications,
  HighlightOff,
  ArrowDropDown,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import NotificationsBlock from "./../notifications/NotificationsBlock";
import Searchbar from "./../searchbar/Searchbar";
import { useSelector } from "react-redux";
import OptionTopBar from "./../optionTopbar/OptionTopBar";
import RequestedFriend from "./../requestedFriend/RequestedFriend";
import {getPostbyID} from './../../api/index';
export default function Topbar({
  getCallBackComment,
  getInfoRequestedFriend,
  setGetStatus,
  setNewRequestedFriend,
  getAccept,
  setOffChat,
  offChat,
}) {
  const [notifications, setNotifications] = useState([]);
  const [newNotifications, setnewNotifications] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [isDropDown, setIsDropDown] = useState(false);
  const [requestFriend, setRequestFriend] = useState([]);
  const [isOpenRequest, setIsOpenRequest] = useState(false);
  const user = useSelector((state) => state.auth).data;
  useEffect(() => {
    if (getInfoRequestedFriend?.status === 2) {
      setRequestFriend([getInfoRequestedFriend, ...requestFriend]);
    } else if (getInfoRequestedFriend?.status === 3) {
      setRequestFriend(
        requestFriend.filter((i) => i._id !== getInfoRequestedFriend._id)
      );
    }
  }, [getInfoRequestedFriend]);

  useEffect(() => {
    if (getAccept) {
      setRequestFriend(requestFriend.filter((i) => i._id !== getAccept.id));
    }
  }, [getAccept, requestFriend]);

  useEffect(() => {
    const fetchUnreadNotificationsUnread = async () => {
      if (user !== null && user !== undefined) {
        let arr = [];
        const res = await axios.get(`/notifications/${user._id}/unread`);
        arr = res.data;
        setnewNotifications(res.data);
        const readed = await axios.get(`/notifications/${user._id}/readed`);
        let arr1 = arr.concat(readed.data);
        setNotifications(arr1.filter((i) => i.senderId !== user._id));
      }
    };
    fetchUnreadNotificationsUnread();
  }, [user]);

  useEffect(() => {
    const fetchAddFriend = async () => {
      if (user !== null && user !== undefined) {
        const res = await axios.get(`/users/${user?._id}/getrequest`);
        setRequestFriend(res.data);
      }
    };
    fetchAddFriend();
  }, [user]);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (search !== "") {
        const res = await axios.get(`/users/finds/${search}`);
        if (res.data) {
          setSearchList(res.data);
        }
      }
    };
    fetchSearchData();
  }, [search]);
  useEffect(() => {
    const fetchNotificationsFromSocket = async () => {
      if(user !== null){
        if (getCallBackComment?.notification !== null) {
          const res = await getPostbyID(getCallBackComment?.postId);
          if(res.data.comments.find(i => i.id === user?._id) && user?._id !== getCallBackComment?.notification.senderId)
          // if (
          //   user?._id === getCallBackComment?.notification?.receiverId &&
          //   user?._id !== getCallBackComment?.notification.senderId
          // ) 
          {
            setnewNotifications([
              getCallBackComment.notification,
              ...newNotifications,
            ]);
            setNotifications([getCallBackComment.notification, ...notifications]);
          }
        }
      }
    }
    fetchNotificationsFromSocket();
  }, [getCallBackComment]);


  if(!user) return null;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }} className="logo">
          FoxSocial
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchBar">
          <Search className="searchIcon" />
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search for friend, post, video"
            className="searchInput"
          />
          {search ? (
            <HighlightOff
              onClick={(e) => setSearch("")}
              className="CloseiconSearchBar"
            />
          ) : (
            ""
          )}
        </div>
        <div className="blockSearch">
          {searchList.length !== 0 && search !== ""
            ? searchList.map(
                (i) =>
                  i._id !== user._id && <Searchbar key={i._id} userInfo={i} />
              )
            : ""}
        </div>
      </div>
      <div className="topbarRight">
        {/* <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div> */}
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person onClick={(e) => setIsOpenRequest(!isOpenRequest)} />
            {requestFriend.length !== 0 ? (
              <span className="topbarIconBadge">{requestFriend.length}</span>
            ) : (
              ""
            )}
            {isOpenRequest ? (
              <div className="requestedFriendBlock">
                {requestFriend.map((i) => (
                  <RequestedFriend
                    user={user}
                    setGetStatus={setGetStatus}
                    requestFriend={requestFriend}
                    setRequestFriend={setRequestFriend}
                    key={i._id}
                    friend={i}
                    setNewRequestedFriend={setNewRequestedFriend}
                  />
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
          <Link to="/messenger" className="topbarIconItem">
            <Chat />
            {/* <span className="topbarIconBadge">2</span> */}
          </Link>
          <div className="topbarIconItem">
            <Notifications onClick={() => setIsShow(!isShow)} />
            {newNotifications.length !== 0 ? (
              <span className="topbarIconBadge">{newNotifications.length}</span>
            ) : (
              ""
            )}
          </div>
        </div>
        {isShow ? (
          <div className="notificationsBlock">
            <p className="notificationsTop">Notifications</p>
            {notifications.map((i) => (
              <NotificationsBlock user={user} key={i._id} content={i} />
            ))}
            {/* <p className="notificationsBottom">View More</p> */}
          </div>
        ) : (
          ""
        )}
        <div
          className="currentUserInfo"
          onClick={(e) => setIsDropDown(!isDropDown)}
        >
          <img
            src={
              user !== null && user.profilePicture !== null && user.profilePicture !== ""
                ? PF + user.profilePicture
                : PF + "/person/default.jpeg"
            }
            alt=""
            className="topbarImg"
          />
          <span className="topBarUserName">{user.username}</span>
          <ArrowDropDown className="dropDownIcon" />
        </div>
      </div>
      {isDropDown ? (
        <div className="dropdownMenu">
          <OptionTopBar offChat={offChat} setOffChat={setOffChat} user={user} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
