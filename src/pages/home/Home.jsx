import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import './home.css';
import {io} from 'socket.io-client';
import { useRef, useEffect, useState } from 'react';
import  {useDispatch, useSelector} from 'react-redux';
import * as authAction from './../../redux/actions/authActions';
export default function Home() {
    const socket = useRef();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [infoOfConversations, setInfoOfConversations] = useState(null);
    const [getInfos, setGetInfos] = useState([]);
    const [getnewMessage, setNewMessage] = useState(null);
    const [getCallBackComment, setGetCallBackComment] = useState(null);
    const [getInfoRequestedFriend, setGetInfoRequestedFriend] = useState([]);
    const [getStatus, setGetStatus] = useState(null);
    const [offChat, setOffChat] = useState(false);
    const [getOnChangeMessage, setGetOnChangeMessage] = useState(null);
    const authData = useSelector(state => state.auth).data;
    const message = useSelector(state => state.auth).message;
    const dispatch = useDispatch();

    useEffect(() =>{
        socket.current = io("ws://localhost:8989");

        socket.current.on("getNewConversationsforReceiveHome", (data) => {
        //    if(data.senderId !== authData._id){
            if(data.currentChat.member.includes(authData._id)){
                setGetInfos({
                    senderId:data.senderId,
                    currentChat: data.currentChat,
                    text:data.text
                });
            }
        //    }
            
        })


        socket.current.on("CallbackMessagetoAllClient", (data) => {
            //console.log(data);
            if(data.isLiked !== null){
                if(data.notification !== null){
                    setGetCallBackComment({
                        senderId:data.senderId,
                        postId: data.postId,
                        comments: data.comments,
                        content: data.content,
                        notification: data.notification,
                        isLiked: data.isLiked
                    })
                }else{
                    setGetCallBackComment({
                        senderId:data.senderId,
                        postId: data.postId,
                        comments: data.comments,
                        content: data.content,                        
                        isLiked: data.isLiked
                    })
                }
            }else{
                setGetCallBackComment({
                    senderId:data.senderId,
                    postId: data.postId,
                    comments: data.comments,
                    content: data.content,
                    notification: data.notification,                   
                })
            }
            
        })
        socket.current.on("SendRequestFriendCallback", (data) => {
            if(data.receiverId === authData._id){
                setGetInfoRequestedFriend({
                    _id: data._id,
                    senderId:data.senderId,
                    receiverId: data.receiverId,
                    createdAt: data.createdAt,
                    status: data.status
                })
            }
        })
    },[authData])

    useEffect(() => {
        if(getStatus){
            socket.current.emit("AcceptOrCancel", getStatus);
        }
    },[getStatus])

    useEffect(() => {
        //Truyền 1 dữ liệu current từ client lên server
        if(authData !== null && authData?.friends && authData?.friends.length > 0){
            socket.current.emit("addUser", authData._id);
            //Online User
            socket.current.on("getUsers", (users) => {
                //console.log(users);
                setOnlineUsers(authData?.friends?.filter((f) => users.some((u) => u.userId === f)));
            })
        }
            
        
    }, [authData, authData.friends])

    useEffect(() =>{
        //console.log(infoOfConversations);
        if(message !== null){
            socket.current.emit("SendNewMessageHome",message);
            dispatch(authAction.removeMessage());
        }
    },[message, dispatch])

    useEffect(() => {
        if(getnewMessage !== null){ 
            socket.current.emit("SendnewComment", getnewMessage)
            setNewMessage(null);
        }
    },[getnewMessage]);
    return (
        <>
            <Topbar offChat={offChat} setOffChat={setOffChat} setGetStatus={setGetStatus} getCallBackComment={getCallBackComment} getInfoRequestedFriend={getInfoRequestedFriend}/>
            <div className="homeContainer">
            <Sidebar/>
            <Feed getCallBackComment={getCallBackComment} setNewMessage={setNewMessage}/>
            <Rightbar setGetOnChangeMessage={setGetOnChangeMessage} offChat={offChat} setGetInfos={setGetInfos} getInfos={getInfos} setInfoOfConversations={setInfoOfConversations} onlineUsers={onlineUsers} />
            </div>
        </>
        
    )
}

