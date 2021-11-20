import './chatOnline.css'
import axios from 'axios';
import {useEffect, useState} from 'react';
export default function ChatOnline({onlineUsers, currentId, setCurrentChat,setConversation, setConversationtoReceiver}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get(`/users/friends/${currentId}`);
            setFriends(res.data);
        }
        getFriends();
    }, [currentId])
    
    useEffect(() => {
       setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    }, [onlineUsers, friends])
    //console.log(onlineFriends);

    const handleClick = async (userId) => {
        try {
            const res = await axios.get(`/conversations/find/${currentId}/${userId}`);
            //setCurrentChat(res.data);
            if(!res.data){
                const data = {
                    senderId: currentId,
                    receiverId: userId
                }
                const conversation = await axios.post('/conversations', data);
                setCurrentChat(conversation.data);
                setConversation((pre) => [...pre,conversation.data])
                setConversationtoReceiver(conversation.data);
            }else{
                setCurrentChat(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="chatOnline">
            {onlineFriends ? onlineFriends.map((i, index) => (
            <div key={index} className="chatOnlineFriends" onClick={() =>handleClick(i._id)}>
                <div className="chatOnlineImgContainer">
                    <img className="chatOnlineImg" src={i.profilePicture ? PF + i.profilePicture : PF + "/person/default.jpeg"} alt="" />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">{i.username}</span>
            </div> 
           )) : ""}
        </div>
    )
}
