import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilled,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@material-ui/icons";
import CloseFriend from "./../closeFriend/CloseFriend";
import {Link} from "react-router-dom";
import axios from "axios";
import { useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import * as api from './../../api/index';
export default function Sidebar() {
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
        const token = JSON.parse(localStorage.getItem('token'));
        //console.log(token.accessToken);
        let currentDate = new Date(); 
        const decodedToken = jwt_decode(token.accessToken);
        if (decodedToken.exp * 1000  < currentDate.getTime()) {
          const data = await refreshToken();
          config.headers["Authorization"] = "Bearer " + data.accessToken;
        }
        return config;   
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const refreshToken = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await axios.post("/auth/refresh", { token: token.refreshToken });
      const tokens = {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken
      }
      if(localStorage.getItem('token') !== null){
        localStorage.removeItem('token');
      }
      localStorage.setItem('token', JSON.stringify(tokens));
      return tokens;
    } catch (err) {
      console.log(err);
    }
  };
  const [suggestFr, setSuggestFr]= useState([]);
  useEffect(() => {
    const fetchSuggestions = async () =>{
      if(localStorage.getItem('token') !== null){
        const res = await api.GetAllUsers();
        //console.log(res);
        setSuggestFr(res.data);
      }
    }
    fetchSuggestions();
  },[]);
  return (
    <div className="sideBar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Link className="linkSideBar" to="/">
              <RssFeed className="sidebarIcon" />
              <span className="sidebarListItemText">Feed</span>
            </Link>
          </li>
          <li className="sidebarListItem">
          <Link className="linkSideBar" to="/messenger">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </Link>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilled className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {suggestFr.map((i) => (
            <CloseFriend key={i._id} user={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}
