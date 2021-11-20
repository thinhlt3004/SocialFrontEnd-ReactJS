import "./clostfriend.css";
import {Link} from "react-router-dom";
export default function CloseFriend({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <>
      <li className="sidebarFriend">
        <Link className="linkToProfileSidebar" to={"/profile/" + user.username} style={{textDecoration: 'none', color: 'black'}}>
          <img className="sidebarFriendImg" src={user.profilePicture ? PF + user.profilePicture : PF + '/person/default.jpeg'} alt="" />
          <span className="sidebarFriendName">{user.username}</span>
        </Link>
      </li>
    </>
  );
}
