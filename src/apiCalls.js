import axios from 'axios';
export const loginCall = async (userCredentails, dispatch) => {
    dispatch({type: 'LOGIN_START'});
    try{
        const res = await axios.post("/auth/login", userCredentails);
        dispatch({type: 'LOGIN_SUCCESS', payload: res.data});
    }catch(e){
        dispatch({type: 'LOGIN_FAILURE', payload: e.message});
    }
}