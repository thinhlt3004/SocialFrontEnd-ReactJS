import './memberGroupChat.css'
import axios from 'axios';
import {useEffect, useState} from 'react';
export default function MemberGroupChat({memberId, currentUser, addMember, groupConversation, setGetMember}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [member, setMember] = useState(null);
    const [getConversation, setGetConversation] = useState([]);
    useEffect(() => {
        const fetchMember = async () => {
            const res = await axios.get(`/users/?userId=${memberId}`);
            setMember(res.data);
        }
        fetchMember();
    },[memberId])
    useEffect(() => {
        setGetConversation(groupConversation);
    },[addMember, memberId, groupConversation])
    console.log(groupConversation);
    const handleAdd = async () => {
       try {
            const res = await axios.put(`/groupconversation/${getConversation._id}/${memberId}`);
            console.log(res.data);
            setGetConversation(getConversation.member.push(memberId));
            setGetMember((prev) => [...prev, memberId]);
       } catch (error) {
           console.log(error);
       }
        
    }
    return (
        <div className="MemberGroupBlock">
            <div className="MemberGroupChat">
                <img src={member?.profilePicture ? PF + member?.profilePicture  : PF + "/person/default.jpeg"}  alt="" className="MemberImage" />
                <span className="MemberName">{member?.username} {currentUser._id ===memberId && '(You)' }</span>
            </div>
            {addMember ?<>{groupConversation.member.includes(memberId)
            ? <button className="AddButtonMember" disabled="disabled">Member</button>  : <button onClick={handleAdd} className="AddButton">Add</button>  }</>  : ""}
        </div>
    )
}
