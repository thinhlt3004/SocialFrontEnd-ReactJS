import './comment.css';
import axios from 'axios';
import {useEffect, useState} from 'react';
export default function Comment({user, own}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [userD, setUserD] = useState({});
    useEffect(() => {
        const fetchUser = async () => {
            try {
                if(user.id){
                    const res = await axios.get(`/users/?userId=${user.id}`);
                    console.log(res.data);
                    setUserD(res.data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchUser();
    },[user.id]);
    return (
        <div className={own? "comment own": "comment"}>                      
               <div className= "commentLoading">
                   <img src={userD.profilePicture ? PF + userD.profilePicture : PF + "/person/default.jpeg"} alt="" className="UserImg" />
                   <div className={own ? "UserContent own" : "UserContent"}>
                       <span className="UserName">{userD.username}</span>
                       <span className="UserDescription">{user.content}</span>
                   </div>
               </div>      
        </div>
    )
}
