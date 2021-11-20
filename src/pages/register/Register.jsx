import './register.css'
import {useRef} from 'react'; 
import axios from 'axios';
import { useHistory } from 'react-router';
export default function Register() {
    const history = useHistory();
    const email = useRef();
    const password = useRef();
    const confirmpassword = useRef();
    const username = useRef();
    const handleClick = async (e) => {
        e.preventDefault();
       if(confirmpassword.current.value !== password.current.value){
            confirmpassword.current.setCustomValidity('Password dont match!');
       }else{
           const user = {
               username: username.current.value,
               password: password.current.value,
               email: email.current.value,
           }
           try{
                await axios.post('/auth/register', user);
                history.push('/');
           }catch(e){
               console.log(e.message);
           }
       }
    }
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">FoxSocial</h3>
                    <span className="loginDesc">
                        Connect with friends and the world aroung you on FoxSocial.
                    </span>
                </div>
                <div className="loginRight">
                    <form onSubmit={handleClick} className="loginBox">
                        <input placeholder="Username" ref={username} type="text" className="loginInput" required/>
                        <input placeholder="Email" ref={email} type="email" className="loginInput" required/>
                        <input placeholder="Password" ref={password} type="password" className="loginInput" required/>
                        <input placeholder="Confirm Password" ref={confirmpassword} type="password" className="loginInput" required/>
                        <button type="submit" className="loginButton">Sign Up</button>
                        <button className="loginRegisterButton">Log into Account</button>
                    </form>
                </div>  
            </div>
        </div>
    )
}
