import './message.css'
import {format} from 'timeago.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
export default function Message({currentUser,message,own}) {
    const [user, setUser] = useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    useEffect(() => {
        const getInfo = async () => {
            if(own){
                setUser(currentUser)
            }else{
                try{
                    const res = await axios.get(`/users/?userId=${message.sender}`);
                    console.log(res.data);
                    setUser(res.data);
                }catch(e){
                    console.log(e);
                }
            }
        }
        getInfo();
    },[currentUser, message.sender, own])
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img className="messageImg" src={user.profilePicture !== "" ? PF + user.profilePicture : PF + "/person/default.jpeg"}  alt="" />
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    )
}
