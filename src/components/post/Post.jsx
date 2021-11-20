import './post.css';
import {HighlightOff, Loyalty, Attachment} from '@material-ui/icons'
import axios from 'axios';
import {useState, useEffect} from 'react';
import {format} from 'timeago.js';
import {Link} from 'react-router-dom';
import Comment from './../comment/Comment';
import { useSelector } from 'react-redux';

export default function Post({post, setNewMessage, getCallBackComment, profile, setPosts}) {
    //Muốn đặt tên trùng thì phải gán nickname
    const currentUser = useSelector(state => state.auth).data;
    const[user, setUser] = useState({});
    //console.log(post);
    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(true);
    const [isImage, setIsImage] = useState(false);
    const [sharer, setSharer] = useState(null);
    const likeHandler = async () => {
        //Set like trong DB , Post : array[]  chua UserId da like
        try{
            await axios.put(`/posts/${post._id}/like`, {userId: currentUser._id });
            //console.log(res.data);
            const notification = {
                receiverId: user._id,
                senderId: currentUser._id,
                postId: post._id,
                likes: true,
            }
            if(isLiked === false){
                const newLike = await axios.post(`/notifications`, notification);
                const getInfoSendtoAll = {
                    senderId: currentUser._id,
                    postId: post._id,
                    likes: true,
                    //content: commentContent,
                    notification: newLike.data,
                    isLiked: isLiked
                }
                setNewMessage(getInfoSendtoAll);
            }
            if(isLiked === true){
                const getInfoSendtoAll = {
                    senderId: currentUser._id,
                    postId: post._id,
                    likes: true,
                    //content: commentContent,
                    //notification: newLike.data,
                    isLiked: isLiked
                }
                setNewMessage(getInfoSendtoAll);

            }          
            

        }catch(err){
            console.log(err.message);
        }
        setLike(!isLiked ? like + 1 : like -1);
        setIsLiked(!isLiked);
    }
    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id));        
    }, [currentUser._id, post.likes])
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    useEffect(() => {
        const fetchData = async () => {     
            if(post.creater){
                const res = await axios.get(`/users?userId=${post.creater}`);         
                setUser(res.data)
                const share = await axios.get(`/users?userId=${post.userId}`);   
                setSharer(share.data);   
            }else{
                const res = await axios.get(`/users?userId=${post.userId}`);
                //console.log(res.data);
                setUser(res.data)
            }
            
        }
        fetchData();
    }, [post.userId, post.creater])
    const [comments, setComments] = useState([])
    useEffect(() => {
        const FetchComment = async () => {
            const res = await axios.get(`/posts/${post._id}/getcomment`);
            //console.log(res.data);
            setComments(res.data.reverse());
        }
        FetchComment();
    },[post._id])
    const[isComment, setIsComment] = useState(false);
    const [commentContent, setcommentContent] = useState('');
    const handleClickComment = async (e) => {
        e.preventDefault();
        //console.log(commentContent);
        const data = {
            userId: currentUser._id,
            content: commentContent
        }
        console.log(data);
        console.log(post._id);
        await axios.post(`/posts/${post._id}/comments`, data);
        const comment = {
            id: currentUser._id,
            content: commentContent
        }
        const notification = {
            receiverId: user._id,
            senderId: currentUser._id,
            postId: post._id,
            comments: true,
            text: commentContent
        }
        if(currentUser._id === post.userId){
            notification.read = true;
        }
        const newComment = await axios.post(`/notifications`, notification);
        console.log(newComment.data);
        //setComments(comments.reverse());
      
            const getInfoSendtoAll = {
                senderId: currentUser._id,
                postId: post._id,
                comments: true,
                content: commentContent,
                notification: newComment.data
            }
            setNewMessage(getInfoSendtoAll);
        
        setComments([comment,...comments]);
        setIsComment(true);

        setcommentContent('');
    }
    //console.log(typeof comments);
    //console.log(comments);

    useEffect(() => {
        if(getCallBackComment){
            if(getCallBackComment.postId === post._id && getCallBackComment.senderId !== currentUser._id){
                if(getCallBackComment.notification){
                    if(getCallBackComment.notification.comments === true){
                        const newMessages = {
                            id: getCallBackComment.senderId,
                            content: getCallBackComment.content
                        }
                        setComments([newMessages,...comments]);
                    }else{
                        setLike(like + 1);
                    }
                }else{                 
                    if(getCallBackComment.isLiked === true){
                        setLike(like - 1);
                    }
                }
            }
        }
    },[getCallBackComment])
    const [popUpImg,setPopUpImg] = useState('');

    //console.log(getCallBackComment);
    const showImage = (img) => {
        //console.log(img);
        setIsImage(true);
        setPopUpImg(img)
    }
    const closeImage = () => {
        console.log('clicked');
        setIsImage(false);
        setPopUpImg('');
    }
    //console.log(isImage);
    const handleShare = async () => {
        if(post.desc){
            const newShare = {
                desc : post.desc
            }
            if(post.img){
                newShare.img = post.img;
            }
            if(post.location){
                newShare.location = post.location;
            }
            if(post.type){
                newShare.type = post.type;
            }
            if(post.feeling){
                newShare.feeling = post.feeling;
            }
                // console.log(newShare)
                // console.log(post.userId);
                // console.log(currentUser._id);
            try {
                await axios.post(`/sharepost/${post.userId}/${currentUser._id}`, newShare);
                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        }else{
            if(post.img){
                const newShare = {
                    img: post.img
                };            
                if(post.location){
                    newShare.location = post.location;
                }
                if(post.type){
                    newShare.type = post.type;
                }
                if(post.feeling){
                    newShare.feeling = post.feeling;
                }
                // console.log(newShare)
                // console.log(post.userId);
                // console.log(currentUser._id);
                try {
                    await axios.post(`/sharepost/${post.userId}/${currentUser._id}`, newShare);
                    window.location.reload();
                } catch (error) {
                    console.log(error);
                }
            }
        }
        
    }
    return (
        <div className="post">
            <div className="postWrapper">
                {sharer !== null ? <p className="sharerP">Shared By  <span className="shareName">{sharer.username}</span></p> : ""}
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link className="postToProfile" to={"/profile/" + user.username}>
                            <img className="postProfileImg" src={user.profilePicture ?PF + user.profilePicture : PF + "/person/default.jpeg"} alt="" />
                            <span className="postUserName">{user.username}</span>
                        </Link>
                        <span className="postDate">{format(post.createdAt)}</span>                       
                    </div>
                    {post.location ? <span className="locationAddressPost">At : {post.location} </span> : ""}
                    <div className="postTopRight">{sharer !== null ? "" : <Attachment onClick={handleShare}/>}</div> 
                </div>
                <div className="postCenter">
                    <div className="postCenterContent">
                        <span className="postText">{post?.desc}</span><br/>
                        {post.feeling && <Loyalty className="iconFeelings"/>}
                        <span className="feelingPostCenter"> {post?.feeling}</span>
                    </div>
                    {post.type === 'video/mp4' 
                    ? <video loop={true} className="shareImg" autoPlay="autoPlay" muted  width="640" height="480" controls>
                        <source src={PF +post.img} type="video/mp4"/>

                        Your browser does not support the video tag.
                        </video>
                    :<img className="postImg" onClick={() => showImage(post.img)} src={post.img ? PF + post.img : ""} alt="" />
                    }
                </div>
                {isImage ? <div className="popUpImgBlock">
                    <div className="cancelDiv" >
                        <span onClick={closeImage} className="closeIconPopUp"><HighlightOff/></span>
                    </div>
                    <div className="imgPopup">
                        <img src={PF + popUpImg} className="popUpImg" alt="" />
                    </div>
                    
                </div> : ""}
                <div className="postBottom">
                    <div className="postBottomLeft">                                       
                        <img className="likeIcon" src={PF + "like.png"} onClick={likeHandler} alt="" />
                        <span className="postLikeCounter">{like} people like it.</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText" onClick={() => setIsComment(!isComment)}>  {comments.length} Comments</span>
                    </div>
                </div>             
               {isComment ? <div>
                <hr classname="hrComment"/> 
                 <form onSubmit={handleClickComment} className="commentInput">
                   <img src={currentUser.profilePicture ? PF + currentUser.profilePicture : PF + '/person/default.jpeg'} alt="" className="CurrentImg" />
                   <input type="text" value={commentContent} onChange={(e) => setcommentContent(e.target.value)} className="commentCurrent" />
                   <button type="submit" className="buttonCurrent">Comment</button>
                </form>
                </div> : ""}
                {isComment && comments.length !== 0 ? <div className="commentContainer"> {comments.map((i) => (<Comment key={i._id} own={currentUser._id === i.id} user={i}/>))} </div> : ""}
               
                
            </div>
            
        </div>
    )
}
