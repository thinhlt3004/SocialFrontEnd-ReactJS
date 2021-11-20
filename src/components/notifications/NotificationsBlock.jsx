import './notifications.css'
import axios from "axios";
import { useEffect, useState } from 'react';
import {format} from 'timeago.js';
import {useHistory} from 'react-router';
export default function NotificationsBlock({content, user}) {
    const history = useHistory();
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friendInfo, setFriendInfo] = useState(null);
    //console.log(content);
    useEffect(() => {
        const getInfoofFriend = async () => {
            const res = await axios.get(`/users/?userId=${content.senderId}`);
            setFriendInfo(res.data);
        }
        getInfoofFriend();
    },[content])
    //console.log(friendInfo);
    const handleClick = async () => {
        await axios.put(`/notifications/${content._id}`);
        history.push("/profile/" + user.username + "?postId=" + content.PostId);
    }
    return (
        <div onClick={handleClick} className="notifications">      
                <img className="imgFriend" src={friendInfo?.profilePicture ? PF + friendInfo.profilePicture : PF + "/person/default.jpeg"} alt="" />
            <div className="contentBlock">
                <span className="notificationsContent" style={{ color: 'black' }}>{friendInfo?.username} {content.comments ? 'commented: '+ content?.text : 'liked your post.'}</span>
                <span className="timeago">{format(content?.createdAt)}</span>
            </div>
            <div className="NewNotificationsAlert">
            {!content.read ? <span className="circlAlert"></span> : ""}
            </div>
        </div>
    )
}
