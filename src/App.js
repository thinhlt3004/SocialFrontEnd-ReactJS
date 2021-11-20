import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import {useEffect} from 'react';
import {useHistory} from 'react-router';
import {Profile, Messenger, Register, Login, Home} from './pages/index';
import { useDispatch, useSelector } from "react-redux";
import * as authActions from './redux/actions/authActions';
function App() {
  const history = useHistory();
  const data = useSelector((state) => state.auth).data;
  
  const dispatch = useDispatch();
  useEffect( () => {
    if(localStorage.getItem("token") !== null){
      dispatch(authActions.refreshLogin.refreshLoginRequest());
    }
  },[dispatch, history]);

  return (
    <Router>     
      <Switch>
        <Route exact path="/">
          {data ? <Home/> : <Login/>}
        </Route>
        <Route exact path="/login">
          {data ? <Redirect to="/" /> : <Login/>}
        </Route>
        <Route exact path="/register">
          {data ? <Redirect to="/" /> : <Register/>}
        </Route>
        <Route exact path="/messenger">
          {!data ?<Redirect to="/" /> : <Messenger/>}
        </Route>
        <Route exact path="/profile/:username">
          {!data ? <Redirect to="/login" /> : <Profile/>}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
