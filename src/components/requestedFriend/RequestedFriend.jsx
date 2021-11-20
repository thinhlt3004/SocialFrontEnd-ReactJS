import "./requestedFriend.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
export default function RequestedFriend({
  user,
  friend,
  requestFriend,
  setRequestFriend,
  setGetStatus,
  setNewRequestedFriend,
}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriend] = useState({});
  useEffect(() => {
    const fetchInfoRequestedFriend = async () => {
      try {
        const res = await axios.get(`/users/?userId=${friend.senderId}`);
        setFriend(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInfoRequestedFriend();
  }, [friend]);
  console.log(friend);
  const handleConfirm = async () => {
    const res = await axios.put(`/users/sendrequest/${friend._id}/status/1`);
    if (!user.followings.includes(friend.senderId)) {
      await axios.put(`/users/${user._id}/follow`, { userId: friend.senderId });
    }
    const friends = await axios.get(`/users/?userId=${friend.senderId}`);
    if (friends.data.followings.includes(user._id)) {
      await axios.put(`/users/${friends.data._id}/follow`, {
        userId: user._id,
      });
    }
    if(setGetStatus){
      setGetStatus({
        request: res.data,
        status: 1
      });
    }
    setRequestFriend(requestFriend.filter((i) => i._id !== friend._id));
    console.log(res.data);
  };
  console.log(friend)
  const handleCancel = async () => {
    if(setGetStatus){
    setGetStatus({
        request: friend,
        status: 3
    });
  }
    const res = await axios.put(`/users/sendrequest/${friend._id}/status/3`);
    setRequestFriend(requestFriend.filter((i) => i._id !== friend._id));
    console.log(res.data);
  };
  return (
    <div className="requestedBlock">
      <Link to={"profile/" + friends.username}>
        <img
          src={
            friends.profilePicture
              ? PF + friends.profilePicture
              : PF + "/person/default.jpeg"
          }
          className="FriendImage"
          alt=""
        />
      </Link>
      <div className="blockInfoRequested">
        <span className="requestName">{friends.username}</span>
        <div className="optionAcceptCancel">
          <button onClick={handleConfirm} className="AcceptButton">
            Confirm
          </button>
          <button onClick={handleCancel} className="CancelButton">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
