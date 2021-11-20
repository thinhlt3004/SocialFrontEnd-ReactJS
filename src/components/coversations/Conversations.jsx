import "./coversations.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";
import axios from "axios";
import { Person, PersonAdd, Cancel } from "@material-ui/icons";
import MemberGroupChat from "./../memberGroupChat/MemberGroupChat";
export default function Conversations({ conversation, groupConversation }) {
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [getMember, setGetMember] = useState([]);
  const [isGet, SetIsGet] = useState(false);
  const [isAdd, SetIsAdd] = useState(false);
  const [file, setFile] = useState(null);
  const [groupConversations, setGroupConversations] = useState([]);
  const [friendOfCurrentUser, setFriendOfCurrentUser] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    setGroupConversations(groupConversation);
  }, [groupConversation]);
  useEffect(() => {
    const getUser = async () => {
      if (conversation) {
        const friendId = conversation.member.find(
          (m) => m !== currentUser?._id
        );

        try {
          const res = await axios.get(`/users/?userId=${friendId}`);
          console.log(res.data);
          setUser(res.data);
        } catch (e) {
          console.log(e);
        }
      }
    };
    getUser();
  }, [currentUser, conversation]);

  const getMemeberofConversation = async () => {
    SetIsGet(!isGet);
    const res = await axios.get(
      `/groupconversation/getConversation/${groupConversation._id}`
    );
    console.log(res.data);
    setGetMember(res.data.member);
  };
  const getListFriendtoAdd = async () => {
    SetIsAdd(!isAdd);
    const res = await axios.get(`/users/friends/${currentUser._id}`);
    setFriendOfCurrentUser(res.data);
  };

  useEffect(() => {
    const handleFile = async () => {
      if (groupConversation !== null) {
        if (file !== null) {
          const data = new FormData();
          data.append("file", file);
          data.append("name", file.name);
          try {
            await axios.post("/uploads/person", data);
          } catch (e) {
            console.log(e);
          }

          const newAvatar = {
            img: `/person/` + file.name,
          };

          setGroupConversations({
            ...groupConversations,
            groupImg: `/person/` + file.name,
          });
          try {
            const res = await axios.post(
              `/groupconversation/${groupConversation._id}/setImage`,
              newAvatar
            );
            console.log(res.data);
          } catch (error) {
            console.log(error);
          }
          setFile(null);
        }
      }
    };
    handleFile();
  }, [file, groupConversation, groupConversations]);

  return (
    <>
      {groupConversation ? (
        <div className="GroupConversations">
          <div className="infoConversation">
            {groupConversation.createrId === currentUser._id ? (
              <label htmlFor="file" className="changeAvatarGroup">
                <img
                  className="coversationImg"
                  src={
                    groupConversations.groupImg
                      ? PF + groupConversations.groupImg
                      : PF + "/person/default.jpeg"
                  }
                  alt=""
                />
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg,.mp4"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            ) : (
              <img
                className="coversationImg"
                src={
                  groupConversations.groupImg
                    ? PF + groupConversations.groupImg
                    : PF + "/person/default.jpeg"
                }
                alt=""
              />
            )}
            <span className="groupConversationName">
              {groupConversations.groupName}
            </span>
          </div>
          <div className="iconConversation">
            <Person
              onClick={getMemeberofConversation}
              className="iconGroupConversation"
            />
            <PersonAdd
              onClick={getListFriendtoAdd}
              className="iconGroupConversation"
            />
          </div>
          {isAdd && (
            <div className="memberContainerFriend">
              <div className="headerMemberContainer">
                <span className="titleHeaderMember">
                  Invite to{" "}
                  <span className="grOupName">
                    {groupConversation.groupName}
                  </span>
                </span>
                <Cancel onClick={(e) => SetIsAdd(!isAdd)} />
              </div>
              <div className="centerMemberContainer">
                {friendOfCurrentUser.map((i) => (
                  <MemberGroupChat
                    setGetMember={setGetMember}
                    addMember
                    groupConversation={groupConversation}
                    currentUser={currentUser}
                    key={i}
                    memberId={i._id}
                  />
                ))}
              </div>
            </div>
          )}
          {isGet && (
            <div className="memberContainer">
              <div className="headerMemberContainer">
                <span className="titleHeaderMember">
                  Member of Group :{" "}
                  <span className="grOupName">
                    {groupConversation.groupName}
                  </span>
                </span>
                <Cancel onClick={(e) => SetIsGet(!isGet)} />
              </div>
              <div className="centerMemberContainer">
                {getMember.map((i) => (
                  <MemberGroupChat
                    currentUser={currentUser}
                    key={i}
                    memberId={i}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="conversations">
          <img
            className="coversationImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "/person/default.jpeg"
            }
            alt=""
          />
          <span className="conversationName">{user.username}</span>
        </div>
      )}
    </>
  );
}
