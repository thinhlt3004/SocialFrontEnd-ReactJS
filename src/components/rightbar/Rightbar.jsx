import "./rightbar.css";
import Online from "./../online/Online";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Add, Remove, Check, Close } from "@material-ui/icons";
import { useSelector } from "react-redux";
import Chatbox from "./../chatbox/Chatbox";
export default function Rightbar({
  user,
  onlineUsers,
  getInfos,
  isImage,
  setNewRequestedFriend,
  getAcceptCancel,
  setGetStatus,
}) {
  const [friends, setFriends] = useState([]);
  const currentUser = useSelector((state) => state.auth).data;
  const [followed, setFollowed] = useState(false);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [isChat, setIsChat] = useState(null);
  const [currentChat, setCurrentChat] = useState([]);
  const [getConversations, setGetConversations] = useState([]);
  const [onlineFriendChoose, setOnlineFriendChoose] = useState(null);
  const [messageFromSocketIO, setMessageFromSocketIO] = useState("");
  const [addFriend, setAddFriend] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendShipInfo, setFriendShipInfo] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [GroupConversation, setGroupConversation] = useState([]);
  const [isGroup, setIsGroup] = useState(null);
  useEffect(() => {
    const checkGroup = async () => {
      if (currentUser !== null && currentUser !== undefined) {
        const res = await axios.get(`groupconversation/${currentUser?._id}`);
        setGroupConversation(res.data);
      }
    };
    checkGroup();
  }, [currentUser]);
  useEffect(() => {
    const FetchFromSockettoReceive = async () => {
      if (currentUser !== null && currentUser !== undefined) {
        if (getInfos?.length !== 0) {
          if (currentChat.length === 0) {
            if (getInfos?.currentChat) {
              setCurrentChat([...currentChat, getInfos?.currentChat]);
            } else {
              setIsChat({
                firstUserId: getInfos?.currentChat?.member[0],
                secondUserId: getInfos?.currentChat?.member[1],
              });
            }
            // currentChat._id === getInfos.currentChat?._id
          } else if (currentChat.length !== 0) {
            if (
              currentChat.find((i) => i._id === getInfos.currentChat?._id) &&
              getInfos.currentChat.member.find((i) => i === currentUser._id) &&
              getInfos.senderId !== currentUser._id
            ) {
              const newMessages = {
                senderId: getInfos.senderId,
                text: getInfos.text,
                createdAt: Date.now(),
              };
              setMessageFromSocketIO(newMessages);
            } else if (
              !currentChat.find((i) => i._id === getInfos.currentChat?._id) &&
              getInfos.currentChat.member.find((i) => i === currentUser._id) &&
              getInfos.senderId !== currentUser._id
            ) {
              setCurrentChat([...currentChat, getInfos?.currentChat]);
              const newMessages = {
                senderId: getInfos.senderId,
                text: getInfos.text,
                createdAt: Date.now(),
              };
              setMessageFromSocketIO(newMessages);
            }
          }
        }
      }
    };
    FetchFromSockettoReceive();
  }, [getInfos, currentChat, currentUser]);
  // console.log(currentChat);
  useEffect(() => {
    const checkFollow = () => {
      if (user !== null && user !== undefined) {
        setFollowed(currentUser?.followings.includes(user?._id));
      }
    };
    checkFollow();
  }, [currentUser, user]);

  useEffect(() => {
    const checkFriend = () => {
      if (user !== undefined && currentUser !== undefined) {
        setAddFriend(currentUser.friends.includes(user?._id));
      }
    };
    checkFriend();
  }, [currentUser, user]);
  //console.log(user);
  useEffect(() => {
    const getFriends = async () => {
      if (user !== undefined && user !== null && user._id !== null) {
        try {
          const userId = user._id;
          const res = await axios.get("/users/friends/" + userId);
          if (res.data) {
            setFriends(res.data);
          }
        } catch (e) {
          console.log(e.message);
        }
      }
    };
    getFriends();
  }, [user]);
  useEffect(() => {
    const getFriendHomepage = async () => {
      if (currentUser !== null && currentUser !== undefined) {
        try {
          const res = await axios.get(`/users/friends/${currentUser._id}`);
          if (res.data) {
            setFriends(res.data);
          }
        } catch (e) {
          console.log(e.message);
        }
      }
    };
    getFriendHomepage();
  }, [currentUser]);
  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers?.includes(f._id)));
  }, [onlineUsers, friends]);

  const followHandle = async () => {
    // try {
    //   if (followed === false) {
    //     await axios.put(`/users/${user._id}/follow`, {
    //       userId: currentUser._id,
    //     });
    //     setFollowed(!followed);
    //     dispatch({ type: "FOLLOW", payload: user._id });
    //   } else if (followed === true) {
    //     await axios.put(`/users/${user._id}/unfollow`, {
    //       userId: currentUser._id,
    //     });
    //     setFollowed(!followed);
    //     dispatch({ type: "UNFOLLOW", payload: user._id });
    //   }
    // } catch (error) {
    //   console.log(error.message);
    // }
  };
  //console.log(friends);
  //Get Conversation in Homepage
  useEffect(() => {
    const getConversation = async () => {
      if (isChat !== null) {
        try {
          const res = await axios.get(
            `/conversations/find/${isChat?.firstUserId}/${isChat?.secondUserId}`
          );
          //console.log(res.data);
          const newCurrentChat = {
            createdAt: Date.now(),
            member: res.data.member,
            _id: res.data._id,
          };
          if (!currentChat.find((i) => i._id === newCurrentChat._id)) {
            console.log(newCurrentChat);
            setCurrentChat([...currentChat, newCurrentChat]);
          } else {
            console.log("Đã Bật");
          }
          // }

          setIsChat(null);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getConversation();
  }, [isChat, currentChat]);

  useEffect(() => {
    // if (!currentChat.find((i) => i._id === isGroup._id)){
    //   setCurrentChat([...currentChat, isGroup]);
    // }
    if (isGroup) {
      if (currentChat.length === 0) {
        setCurrentChat([...currentChat, isGroup]);
        setIsGroup(null);
      } else if (!currentChat.find((i) => i._id === isGroup._id)) {
        setCurrentChat([...currentChat, isGroup]);
        setIsGroup(null);
      }
    }
  }, [isGroup, currentChat]);
  // console.log(isGroup);

  //console.log(currentChat);
  //check status request if dont be currentUser
  useEffect(() => {
    const getStatusFriendRequest = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `/users/getStatus/${currentUser?._id}/${user?._id}`
          );
          if (res.data !== null) {
            setFriendShipInfo(res.data);
            if (res.data.status === 2) {
              setIsFriend(true);
            } else if (res.data.status === 1) {
              setAddFriend(true);
            }
          } else if (res.data === null) {
            setIsFriend(false);
          }
        } catch (e) {
          console.log(e.message);
        }
      }
    };
    getStatusFriendRequest();
  }, [currentUser, user]);
  //check status request if  currentUser
  useEffect(() => {
    const checkStatusProfileCurrent = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `/users/getStatus/${user?._id}/${currentUser?._id}`
          );
          // console.log(res.data);
          if (
            currentUser._id === res.data.receiverId &&
            res.data.status === 2
          ) {
            setFriendShipInfo(res.data);
            setIsCurrentUser(true);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    };
    checkStatusProfileCurrent();
  }, [currentUser, user]);
  // console.log(isCurrentUser);
  const handleAddFriend = async () => {
    if (isFriend === false) {
      const data = {
        senderId: currentUser._id,
        receiverId: user._id,
      };
      const res = await axios.post(`/users/sendrequest`, data);
      console.log(res.data);
      setFriendShipInfo(res.data);
      setIsFriend(!isFriend);
      setNewRequestedFriend({
        request: res.data,
        status: 2,
      });
    } else {
      await axios.put(`/users/sendrequest/${friendShipInfo._id}/status/3`);
      setNewRequestedFriend({
        request: friendShipInfo,
        status: 3,
      });
      // console.log("Unfriend");
      setFriendShipInfo(null);
      setIsFriend(!isFriend);
    }
  };
  const handleClickAcceptFriend = async () => {
    // friendShipInfo
    const res = await axios.put(
      `/users/sendrequest/${friendShipInfo._id}/status/1`
    );
    if (!currentUser.followings.includes(user._id)) {
      await axios.put(`/users/${currentUser._id}/follow`, { userId: user._id });
    }
    if (!user.followings.includes(currentUser._id)) {
      await axios.put(`/users/${user._id}/follow`, { userId: currentUser._id });
    }
    setGetStatus({
      request: res.data,
      status: 1,
    });
    setFollowed(true);
    setIsCurrentUser(false);
    setAddFriend(true);
  };
  // console.log(friendShipInfo);
  useEffect(() => {
    if (getAcceptCancel) {
      if (getAcceptCancel.status === 1) {
        setFollowed(true);
        setIsCurrentUser(false);
        setAddFriend(true);
      } else if (getAcceptCancel.status === 3) {
        setFollowed(false);
        setIsCurrentUser(false);
        setAddFriend(false);
        setIsFriend(false);
      }
    }
  }, [getAcceptCancel]);

  const HomeRightBar = () => {
    if (!currentUser) return null;
    return (
      <>
        {!isImage ? (
          <>
            <a
              href="https://www.msi.com/index.php"
              rel="noreferrer"
              target="_blank"
            >
              <img
                src="https://asset.msi.com/global/picture/news/2017/mb/vega-msi-20170411.jpg"
                height="350px"
                alt=""
                className="rightBarAd"
              />
            </a>

            <ul className="rightbarFriendList">
              {GroupConversation.length !== 0 ? (
                <>
                  <h4 className="rightbarTitle">Group</h4>
                  {GroupConversation.map((i) => (
                    <Online
                      group
                      setIsGroup={setIsGroup}
                      groupConversation={i}
                      key={i._id}
                    />
                  ))}
                </>
              ) : (
                ""
              )}
              <h4 className="rightbarTitle">Online Friends</h4>
              {onlineFriends.map((i) => (
                <Online
                  setOnlineFriendChoose={setOnlineFriendChoose}
                  setIsChat={setIsChat}
                  user={currentUser}
                  isChat={isChat}
                  key={i._id}
                  onlineFriend={i}
                />
              ))}
            </ul>
            {/* {isChat ? <Chatbox/> : ""} */}
            <div className="chatBoxHome">
              {currentChat.length !== 0
                ? currentChat.map((i) => (
                    <Chatbox
                      key={i._id}
                      getInfos={getInfos}
                      setMessageFromSocketIO={setMessageFromSocketIO}
                      messageFromSocketIO={messageFromSocketIO}
                      FriendOnliness={onlineFriends}
                      currentChats={currentChat}
                      onlineFriendChoose={onlineFriendChoose}
                      currentChat={i}
                      setGetConversations={setGetConversations}
                      setIsChat={setIsChat}
                      setCurrentChat={setCurrentChat}
                      currentUser={currentUser}
                      getConversations={getConversations}
                      
                    />
                  ))
                : ""}
            </div>
          </>
        ) : (
          ""
        )}
      </>
    );
  };
  const ProfileRightBar = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    if (!currentUser && !user) return null;
    return (
      <>
        {user !== null &&
        currentUser !== null &&
        user?.username !== currentUser?.username ? (
          <div className="buttonFollowAdd">
            <button
              className={
                followed
                  ? "rightbarFollowButton friend"
                  : "rightbarFollowButton"
              }
              onClick={followHandle}
            >
              {followed ? "Unfollow" : "Follow"}
              {followed ? <Remove /> : <Add />}
            </button>
            {isCurrentUser ? (
              <button
                onClick={handleClickAcceptFriend}
                className="rightbarFollowButton"
              >
                Accept <Check />
              </button>
            ) : (
              <>
                {addFriend ? (
                  <button
                    className="rightbarFollowButton friend"
                    disabled="disabled"
                  >
                    Friend <Check />
                  </button>
                ) : (
                  <button
                    className="rightbarFollowButton"
                    onClick={handleAddFriend}
                  >
                    {isFriend ? "Requested" : "Add Friend"}
                    {isFriend ? <Close /> : <Add />}
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          ""
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City: </span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From: </span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship: </span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Married"
                : user.relationship === 2
                ? "In a Relationship"
                : "Single"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend, key) => (
            <Link
              key={friend._id}
              className="LinktoProfileRightbar"
              to={"/profile/" + friend.username}
            >
              <div key={friend._id} className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "/person/default.jpeg"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightBar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightBar /> : <HomeRightBar />}
      </div>
    </div>
  );
}
