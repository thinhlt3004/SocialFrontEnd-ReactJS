import './share.css';
import {PermMedia, Room, EmojiEmotions, Cancel} from '@material-ui/icons';
import {  useRef, useState } from 'react';
import EmojiFeeling from "./../Emoji/EmojiFeeling";
import axios from 'axios';
import { useSelector } from 'react-redux';
export default function Share() {
    const user = useSelector(state => state.auth).data;
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const desc = useRef();
    //Set Upload Img
    const [file, setFile] = useState(null);
    const [isFeel,setIsFeel] = useState(false);
    const [chooseFeeling, setChooseFeeling] = useState(null);
    const submitHandler = async (e) => {
        e.preventDefault();
        const newPost = {
            userId : user._id,
            desc : desc.current.value,           
        }
       
        if(file){
            if(file.type === 'video/mp4' ){
                newPost.type = file.type;
            }
            const data = new FormData();
            data.append('file',file);            
            data.append('name', file.name);
            newPost.img = file.name;
            try {
                await axios.post('/uploads', data);
            } catch (e) {
                console.log(e);
            }
        }
        if(address){
            newPost.location = address;
        }
        if(chooseFeeling){
            newPost.feeling = chooseFeeling;
        }
        
        try{
            await axios.post('/posts', newPost);
            window.location.reload();
        }catch(e){
            console.log(e.message);
        }
    }
    const [address, setAddress] = useState(null);
   
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCoordinates, handleLocationError);
        } else {
           console.log("Geolocation is not supported by this browser.");
        }
    }

    const handleLocationError = (error) =>  {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            // console.log("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            // console.log("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            // console.log("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            // console.log("An unknown error occurred.");
            break;
            default:break;
        }
      }
    const getCoordinates = (position) => {
        getUserAddress(position.coords.latitude, position.coords.longitude);
    }
    const getUserAddress = (latitude, longitude) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true&key=GOOGLE_API_KEY`)
        .then(res => res.json())
        .then(data => setAddress(data.results[0].formatted_address))
        .catch(error => console.log(error));        
    }
    const handleFeelings = (feel) => {
        setChooseFeeling(feel);
        setIsFeel(false);
    }

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF + "/person/default.jpeg"} alt="" />
                    <div className="spanAddressPost">
                    <div className="textFeelingdiv">
                    <input type="text" ref={desc} placeholder={"What 's in your mind "+user.username + " ? "} className="shareInput" />
                    {chooseFeeling ? <span className="feelingShare"> {chooseFeeling} </span> : ""}
                    </div>
                    {address ? <span className="locationAddress">at . {address}</span> : ""}
                    </div>
                </div>
                <hr className="shareHr" />
                {file ? <>{ file.type === 'video/mp4' 
                ?   <div className="shareImgContainer">
                    <iframe width="640" height="480" title="Frames"  allow="autoplay 'none'" className="shareImg" src={URL.createObjectURL(file)} volume="silent"></iframe>
                    <Cancel className="shareCancelImg" onClick={() =>setFile(null)} />
                    </div> 
                :   <div className="shareImgContainer">
                    <img width="640" height="480"  className="shareImg" src={URL.createObjectURL(file)}  alt=""/>
                    <Cancel className="shareCancelImg" onClick={() =>setFile(null)} />
                    </div> 
                }</> : ""}
                <form className="shareBottom" onSubmit={submitHandler}>
                    <label htmlFor="file" className="shareOption">
                        <PermMedia htmlColor="tomato" className="shareIcon"/>
                        <span className="shareOptionText">Photo/Video</span>
                        <input style={{ display: 'none' }} type="file" id="file" accept=".png,.jpeg,.jpg,.mp4" onChange={(e) => setFile(e.target.files[0])} />
                    </label>
                    {/* <div className="shareOption" >
                        <Label htmlColor="blue" className="shareIcon"/>
                        <span className="shareOptionText">Tag</span>
                    </div> */}
                    {address 
                    ?<div className="shareOption">
                        <Room htmlColor="blue" className="shareIcon"/>
                        <span className="shareOptionText">Location</span>
                    </div>
                    :<div className="shareOption" onClick={getLocation}>
                        <Room htmlColor="blue" className="shareIcon"/>
                        <span className="shareOptionText">Location</span>
                    </div>}
                    <div className="shareOption" onClick={(e) => setIsFeel(!isFeel)}>
                        <EmojiEmotions htmlColor="gold" className="shareIcon"/>
                        <span className="shareOptionText">Feelings</span>                        
                    </div>
                       {isFeel ? <div className="panelFeeling">
                            <Cancel onClick={(e) => setIsFeel(!isFeel)}  className="cancelFeeling"/>
                            <EmojiFeeling setChooseFeeling={handleFeelings} />
                        </div> : ""}
                    <button type="submit" className="shareButton">Share</button>
                </form>
            </div>
        </div>
    )
}
