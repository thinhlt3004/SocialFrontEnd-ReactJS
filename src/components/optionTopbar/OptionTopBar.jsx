import './optionTopBar.css'
import {Link} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import createBrowserHistory from "history/createBrowserHistory";
export default function OptionTopBar({user}) {
    const history = createBrowserHistory({ forceRefresh: true });
    const logoutUser = () => {
        localStorage.removeItem('token');
        history.push("/login");
    }
    return (
        <div className="OptionTopBar">         
                <Link to={"/profile/" + user.username} className="profileDiv">
                <AccountCircleIcon className="IconOption"/> 
                <span className="OptionTopBarProfile" >See your profile</span>
                </Link>
                <div className="logoutDiv" onClick={logoutUser}>
                <ExitToAppIcon className="IconOption"/>
                <span className="logOut">  Log Out</span>
                </div>
        </div>
    )
}
