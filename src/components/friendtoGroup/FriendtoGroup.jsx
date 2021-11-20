import './friendtoGroup.css'
import { useState } from 'react';
import { Cancel, Publish } from '@material-ui/icons';
import axios from 'axios';
export default function FriendtoGroup({user, setIsCreateGroup, isCreateGroup, setGroupConversation}) {
    const [file, setFile] = useState(null);
    const [groupName, setGroupName] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newGroup = {
            createrId: user._id,
            groupName: groupName,
        }
        if(file){
            const data = new FormData();
            data.append('file',file);            
            data.append('name', file.name);
            // console.log(typeof data);
            // console.log(file);
            newGroup.groupImg = `/person/` + file.name;
            try {
                await axios.post("/uploads/person", data);
            } catch (e) {
                console.log(e);
            }
        }
        try {
            const res = await axios.post("/groupconversation", newGroup);
            console.log(res.data);
            setGroupConversation((prev) => [...prev, res.data]);
            setIsCreateGroup(!isCreateGroup);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <form className="friendtoGroup" onSubmit={handleSubmit}>
            <h2 className="title">Create Group</h2>
            <div className="nameOfGroup">
                <span className="nameTitle">Name of Group</span>
                <input value={groupName} onChange={(e) => setGroupName(e.target.value)} type="text" className="nameGroup" required="required" />
            </div>
            <div className="imageOfGroup">
                <span className="imageTitle">Image of Group :</span>                
                <label htmlFor="file" className="shareOption">
                        <Publish htmlColor="tomato" className="shareIcon"/>
                        <span className="shareOptionText">Photo</span>
                        <input style={{ display: 'none' }} type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e) => setFile(e.target.files[0])} />
                </label>
            </div>
            {file ? <div className="imgBlockGroup">
                    <img className="imgGroup" src={URL.createObjectURL(file)}  alt=""/>
                    <Cancel className="imgCancel" onClick={() =>setFile(null)} />
            </div> : ""}            
            <div className="blockSubmit">
                <span></span>
                <div className="buttonBlock">
                <button className="submitNewGroup">Create</button>   
                <button onClick={(e) => setIsCreateGroup(!isCreateGroup)} className="cancelNewGroup">Cancel</button>   
                </div>    
            </div>
        </form>
    )
}
