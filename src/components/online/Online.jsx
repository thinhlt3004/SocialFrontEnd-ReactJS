import "./online.css";
import axios from "axios";
export default function Online({ onlineFriend, setIsChat, user,groupConversation, group, setIsGroup }) {
  //console.log(onlineFriend);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const popUpGroup = () => {
    setIsGroup(groupConversation);
  }
  const checkUserConversation = async () => {
    const res = await axios.get(`/conversations/find/${onlineFriend?._id}/${user?._id}`);
    if(!res.data){
      const newData = {
        senderId: onlineFriend?._id,
        receiverId: user?._id
      };
      await axios.post(`/conversations`,newData);
      setIsChat(
        {
          firstUserId: onlineFriend?._id,
          secondUserId: user?._id
        });
    }
    else{
      setIsChat(
        {
          firstUserId: onlineFriend?._id,
          secondUserId: user?._id
        });
    }
  }
  
  return (
    <div>
      {group? 
      <li className="rightbarFriend" onClick={popUpGroup}>
        <div className="rightbarProfileImgContainer">
          <img
            src={groupConversation.groupImg ? PF + groupConversation.groupImg  : PF + '/person/default.jpeg'}
            className="rightbarProfileImg"
            alt=""
          />
          <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarUsername">{groupConversation.groupName}</span>
      </li>
      :<li className="rightbarFriend" onClick={checkUserConversation}>
        <div className="rightbarProfileImgContainer">
          <img
            src={onlineFriend.profilePicture ? PF + onlineFriend.profilePicture : PF + '/person/default.jpeg'}
            className="rightbarProfileImg"
            alt=""
          />
          <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarUsername">{onlineFriend.username}</span>
       </li>}
    </div>
  );
}
