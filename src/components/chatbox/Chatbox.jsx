import "./chatbox.css";
import { Close } from "@material-ui/icons";
import axios from "axios";
import MessageHome from "./../massageHome/MessageHome";
import { useState, useRef, useCallback } from "react";
import { useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import * as authActions from "./../../redux/actions/authActions";
import { useDispatch } from "react-redux";
export default function Chatbox({
  currentUser,
  setCurrentChat,
  currentChat,
  currentChats,
  messageFromSocketIO,
  setMessageFromSocketIO,
  getInfos,
}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [getMessage, setGetMessage] = useState([]);
  const [getMessages, setGetMessages] = useState("");
  //console.log(currentChat);
  const [friendOnline, setFriendOnline] = useState({});
  const scrollRef = useRef();
  const [group, setGroup] = useState([]);
  const FriendId = currentChat?.member.find((i) => i !== currentUser?._id);
  const dispatch = useDispatch();
  const closeChat = () => {
    setCurrentChat(currentChats.filter((c) => c !== currentChat));
  };
  // console.log(currentChats);
  // console.log(currentChat);
  useEffect(() => {
    if (messageFromSocketIO !== "") {
      if (
        currentChat?._id === getInfos.currentChat?._id &&
        currentUser._id !== getInfos.senderId
      ) {
        setGetMessage([...getMessage, messageFromSocketIO]);
        setMessageFromSocketIO("");
      }
    }
  }, [
    messageFromSocketIO,
    currentChat?._id,
    currentUser._id,
    getInfos.currentChat?._id,
    getInfos.senderId,
    getMessage,
    setMessageFromSocketIO,
  ]);

  // console.log(currentChat);
  useEffect(() => {
    const fetchInfo = async () => {
      if (
        currentChat.member.length >= 2 &&
        currentChat.groupName &&
        currentChats.find((i) => i._id === currentChat._id)
      ) {
        const res = await axios.get(
          `/groupconversation/getConversation/${currentChat._id}`
        );
        setGroup(res.data);
        const conversation = await axios.get(`/messages/${currentChat?._id}`);
        setGetMessage(
          conversation.data.sort((p1, p2) => {
            return new Date(p1.createdAt) - new Date(p2.createdAt);
          })
        );
      } else if (
        currentChat.member.length === 2 &&
        currentChats.find((i) => i._id === currentChat._id)
      ) {
        const FriendId = currentChat?.member.find(
          (i) => i !== currentUser?._id
        );
        const res = await axios.get(`/users/?userId=${FriendId}`);
        setFriendOnline(res.data);
        const conversation = await axios.get(`/messages/${currentChat?._id}`);
        setGetMessage(
          conversation.data.sort((p1, p2) => {
            return new Date(p1.createdAt) - new Date(p2.createdAt);
          })
        );
      }

      console.log("render 1 times");
    };
    fetchInfo();
  }, [
    currentChat._id,
    currentChat.groupName,
    currentChat.member,
    currentChats,
    currentUser?._id,
  ]);
  const sendMessagetoSocketIO = useCallback(
    (messageInfoNews) => {
      dispatch(authActions.sendMessage(messageInfoNews));
    },
    [dispatch]
  );
  const handleClickSubmit = useCallback(
    async (e) => {
      if (getMessages !== "") {
        e.preventDefault();
        try {
          //Tạo đối tượng gửi vào collection Messages
          const data = {
            sender: currentUser._id,
            text: getMessages,
            conversationId: currentChat._id,
          };
          //Thêm vào DB messages
          const res = await axios.post(`/messages`, data);
          const newMessages = {
            _id: res.data._id,
            sender: res.data.sender,
            text: res.data.text,
            conversationId: res.data.conversationId,
            createdAt: Date.now(),
          };
          if (currentChat._id === res.data.conversationId) {
            setGetMessage([...getMessage, newMessages]);
          }
          setGetMessages("");

          sendMessagetoSocketIO({
            currentChat: currentChat,
            senderId: res.data.sender,
            text: res.data.text,
            receiveId: FriendId,
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
    [getMessages, FriendId, currentChat, currentUser, getMessage, sendMessagetoSocketIO]
  );

  useEffect(() => {
    //Giúp cho khi send new Message sẽ scroll rồi kéo xuống
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [getMessage]);
  //console.log(scrollRef.current);
  return (
    <>
      {group.length !== 0 ? (
        <div className="chatbox">
          <div className="chatBoxWrapperHome">
            <div className="chatboxTops">
              <div className="FriendInfo">
                <img
                  src={
                    group.groupImg
                      ? PF + group.groupImg
                      : PF + "/person/default.jpeg"
                  }
                  alt=""
                  className="FriendImg"
                />
                <span className="FriendName">{group.groupName}</span>
              </div>
              <span onClick={closeChat} className="closeIcon">
                <Close />
              </span>
            </div>
            <div className="chatBoxCenter">
              {/* <ScrollableFeed> */}
              {getMessage.length > 0 ? (
                getMessage.map((i) => (
                  <div>
                    <MessageHome
                      group
                      key={i._id}
                      currentUser={currentUser}
                      message={i}
                      own={i.sender === currentUser._id}
                    />
                  </div>
                ))
              ) : (
                <img
                  className="loadingRollMessage"
                  alt=""
                  src={PF + "/loadingroll.gif"}
                ></img>
              )}
              {/* </ScrollableFeed> */}
            </div>
            <div className="chatBoxBottom">
              <input
                type="text"
                value={getMessages}
                onChange={(e) => setGetMessages(e.target.value)}
                placeholder="Send a message..."
                className="chatMessageSend"
              />
              <button onClick={handleClickSubmit} className="chatSubmitButton">
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="chatbox">
          <div className="chatBoxWrapperHome">
            <div className="chatboxTops">
              <div className="FriendInfo">
                {friendOnline.profilePicture && (
                  <img
                    src={PF + friendOnline.profilePicture}
                    alt=""
                    className="FriendImg"
                  />
                )}
                <span className="FriendName">
                  {friendOnline.username ? (
                    friendOnline.username
                  ) : (
                    <div className="loadingChat">
                      <span>Processing</span>{" "}
                      <img height="30" src={PF + "/loading.gif"} alt="" />
                    </div>
                  )}
                </span>
              </div>
              <span onClick={closeChat} className="closeIcon">
                <Close />
              </span>
            </div>
            <div className="chatBoxCenter">
              <ScrollableFeed>
                {getMessage.length > 0 ? (
                  getMessage.map((i) => (
                    <div>
                      <MessageHome
                        key={i._id}
                        currentUser={currentUser}
                        message={i}
                        own={i.sender === currentUser._id}
                      />
                    </div>
                  ))
                ) : (
                  <img
                    className="loadingRollMessage"
                    alt=""
                    src={PF + "/loadingroll.gif"}
                  ></img>
                )}
              </ScrollableFeed>
            </div>
            <div className="chatBoxBottom">
              <input
                type="text"
                value={getMessages}
                onChange={(e) => setGetMessages(e.target.value)}
                placeholder="Send a message..."
                className="chatMessageSend"
              />
              <button onClick={handleClickSubmit} className="chatSubmitButton">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
