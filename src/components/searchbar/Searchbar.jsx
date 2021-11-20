import './searchbar.css';
import { useContext } from 'react';
import { AuthContext } from './../../context/AuthContext';
import {Link } from 'react-router-dom';
export default function Searchbar({userInfo}) {
    const {user} = useContext(AuthContext);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <Link to={"/profile/" + userInfo.username} className="searchbar">
            <img className="imgBar" src={userInfo.profilePicture ? PF + userInfo.profilePicture : PF + '/person/default.jpeg'} height="30" width="30" alt="" />
            <div className="contentInfo">
                <span className="friendName">{userInfo.username}</span>
                <span className="relationship">{user.friends.includes(userInfo._id) ? 'Friend' : 'Stranger'}</span>
            </div>
        </Link> 
    )
}
