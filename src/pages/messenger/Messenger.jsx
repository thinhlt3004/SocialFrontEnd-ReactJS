import "./messenger.css";
import Topbar from "./../../components/topbar/Topbar";
import Conversations from "./../../components/coversations/Conversations";
import Message from "./../../components/message/Message";
import ChatOnline from "./../../components/chatOnline/ChatOnline";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import { io } from "socket.io-client";
import FriendtoGroup from "./../../components/friendtoGroup/FriendtoGroup";
import { useSelector } from "react-redux";
export default function Messenger() {
  const [conversation, setConversation] = useState([]);
  const [groupConversation, setGroupConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");
  const [ArrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { data: user } = useSelector((state) => state.auth);

  const scrollRef = useRef();
  const [getCon, setCon] = useState(null);
  const [isCreateGroup, setIsCreateGroup] = useState(false);

  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8989");
    socket.current.on("getNewConversationsforReceiveHome", (data) => {
      console.log(data);
      if (data.currentChat.member.includes(user._id)) {
        if (user._id !== data.senderId) {
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        }
      }
    });

    socket.current.on("getNewConversationsforReceive", (data) => {
      if (data.conversation._id === currentChat._id) {
        setCon(data.conversation);
      }
    });
  }, [currentChat?._id, user._id]);

  useEffect(() => {
    getCon && setConversation([...conversation, getCon]);
  }, [getCon, conversation]);

  const setConversationtoReceiver = (conversations) => {
    socket.current.emit("sendNewConversation", {
      conversation: conversations,
    });
  };

  useEffect(() => {
    if (ArrivalMessage !== null) {
      ArrivalMessage &&
        currentChat.member.includes(ArrivalMessage.sender) &&
        setMessages([...messages, ArrivalMessage]);
      setArrivalMessage(null);
    }
  }, [ArrivalMessage, currentChat?.member]);

  useEffect(() => {
    //Truyền 1 dữ liệu current từ client lên server
    socket.current.emit("addUser", user._id);
    //Online User
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.friends.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  //EndSocket

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(`/conversations/${user._id}`);
        console.log(res.data);
        setConversation(res.data);
      } catch (e) {
        console.log(e.message);
      }
    };
    getConversation();

    const getGroupImage = async () => {
      try {
        const res = await axios.get(`/groupconversation/${user._id}`);

        setGroupConversation(res.data);
      } catch (e) {
        console.log(e.message);
      }
    };
    getGroupImage();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/messages/${currentChat._id}`);
        setMessages(
          res.data.sort((p1, p2) => {
            return new Date(p1.createdAt) - new Date(p2.createdAt);
          })
        );
      } catch (e) {
        console.log(e.message);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSumitSendMessages = useCallback(
    async (e) => {
      if (newMessages !== "") {
        e.preventDefault();
        const message = {
          sender: user._id,
          text: newMessages,
          conversationId: currentChat._id,
        };
        const receiveId = currentChat.member.find((i) => i !== user._id);
        socket.current.emit("SendNewMessageHome", {
          senderId: user._id,
          receiveId: receiveId,
          text: newMessages,
          currentChat: currentChat,
        });
        try {
          const res = await axios.post(`/messages/`, message);
          setMessages([...messages, res.data]);
          setNewMessages("");
        } catch (e) {
          console.log(e.message);
        }
      }
    },
    [newMessages, messages, currentChat, user]
  );
  //

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              placeholder="Search for friends"
              type="text"
              className="chatMenuInput"
            />

            {groupConversation.length > 0
              ? groupConversation.map((i) => (
                  <div onClick={() => setCurrentChat(i)}>
                    <Conversations
                      key={i._id}
                      groupConversation={i}
                      setGroupConversation={setGroupConversation}
                    />
                  </div>
                ))
              : ""}

            {conversation
              ? conversation.map((i) => (
                  <div key={i._id} onClick={() => setCurrentChat(i)}>
                    <Conversations conversation={i} />
                  </div>
                ))
              : ""}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTops">
                  {messages.map((m, index) => (
                    <div ref={scrollRef}>
                      <Message
                        key={index}
                        currentUser={user}
                        message={m}
                        own={m.sender === user._id}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    value={newMessages}
                    onChange={(e) => setNewMessages(e.target.value)}
                    className="chatMessageInput"
                    placeholder="Write something..."
                  ></textarea>
                  <button
                    onClick={handleSumitSendMessages}
                    className="chatSubmitButton"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationChat">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div
            className="groupChat"
            onClick={(e) => setIsCreateGroup(!isCreateGroup)}
          >
            <AddIcon className="IconAddGroupChat" />
            <span className="TextAddGroupChat">Create New Group</span>
          </div>
          {isCreateGroup ? (
            <div className="panelCreateGroup">
              <FriendtoGroup
                setGroupConversation={setGroupConversation}
                user={user}
                setIsCreateGroup={setIsCreateGroup}
                isCreateGroup={isCreateGroup}
              />
            </div>
          ) : (
            ""
          )}
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
              setConversation={setConversation}
              setConversationtoReceiver={setConversationtoReceiver}
            />
          </div>
        </div>
      </div>
    </>
  );
}
