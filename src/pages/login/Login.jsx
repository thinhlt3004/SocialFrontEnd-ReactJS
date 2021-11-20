import "./login.css";
import { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "./../../redux/actions/authActions";
export default function Login() {
  const history = useHistory();
  const email = useRef();
  const password = useRef();
  const {isFalse, isLoading, data} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isWrong, setIsWrong] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    const userLogin = {
      email: email.current.value,
      password: password.current.value,
    };
    dispatch(authActions.getUser.getUserRequest(userLogin));
  };
  useEffect(() => {
    if(isFalse){
        setIsWrong(true);
        return;
    }
    if(data !== null){
        history.push('/');
    }
  },[data, isFalse, history])
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
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="text"
              className="loginInput"
              ref={email}
              required
            />
            <input
              placeholder="Password"
              minLength="6"
              type="password"
              className="loginInput"
              ref={password}
              required
            />
            {isWrong ? (
              <span className="loginError">
                Your UserName or Password was wrong...
              </span>
            ) : (
              ""
            )}
            <button type="submit" className="loginButton">
              {isLoading ? <CircularProgress size="20px" /> : "Log In"}
            </button>
            <span className="loginForgot">Forgot Password ?</span>
            {!isLoading ? (
              <Link to="/register" className="loginRegisterButton">
                Create a New Account{" "}
              </Link>
            ) : (
              <button className="loginRegisterButton" disabled>
                Create a New Account
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
