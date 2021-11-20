import './messageHome.css';
import {format} from 'timeago.js';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
export default function MessageHome({own, currentUser, message, group}) {
    //console.log(own);
    const [user, setUser] = useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    useEffect(() => {
        const getInfo = async () => {
            if(own){
                setUser(currentUser)
            }else{
                try{
                    const res = await axios.get(`/users/?userId=${message.sender}`);
                    setUser(res.data);
                }catch(e){
                    console.log(e);
                }
            }
        }
        getInfo();
    },[message, currentUser, own])  

   
    return (
        <div>
            {group 
            ?<div className={own ?"messagesItem own" : "messagesItem"}>
                    <div className="messageTopSide">
                        {own 
                        ?<><span className="MessageText">{message.text}</span>
                        <img className="FriendImgMessage" src={user.profilePicture !==null ? PF + user.profilePicture : PF + "/person/default.jpeg"} alt="" /></> 
                        :<><img className="FriendImgMessage" src={user.profilePicture !==null ? PF + user.profilePicture : PF + "/person/default.jpeg"} alt="" /> 
                        <span className="MessageText">{message.text}</span></>}
                    </div>
                    <div className="timeofMessage">{format(message.createdAt)}</div>
            </div>
            :<div className={own ?"messagesItem own" : "messagesItem"}>
                    <div className="messageTopSide">                        
                        <span className="MessageText">{message.text}</span>
                    </div>
                    <div className="timeofMessage">{format(message.createdAt)}</div>
            </div>
            }
        </div>
    )
}
