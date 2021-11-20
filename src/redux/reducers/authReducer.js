import { INITIAL_STATE } from "./../constant";
import {
  getType,
  getUser,
  refreshLogin,
  logOut,
  sendMessage,
  removeMessage,
  follow,
  unfollow,
  upadateProfilePicture,
} from "./../actions/authActions.js";

export default function AuthReducer(state = INITIAL_STATE.auth, action) {
  switch (action.type) {
    case getType(getUser.getUserRequest):
      return {
        ...state,
        isLoading: true,
      };
    case getType(getUser.getUserSuccess):
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    case getType(getUser.getUserFailure):
      return {
        ...state,
        isLoading: false,
        isFalse: true,
      };
    case getType(refreshLogin.refreshLoginRequest):
      return {
        ...state,
        isLoading: true,
      };
    case getType(refreshLogin.refreshLoginSuccess):
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    case getType(refreshLogin.refreshLoginFailure):
      return {
        ...state,
        isLoading: false,
        isFalse: true,
      };
    case getType(sendMessage):
      return { ...state, message: action.payload };
    case getType(removeMessage):
      return { ...state, message: null };
    case getType(follow):
      let userData = state.data.user;
      userData.followings = [...userData.followings, action.payload];
      return { ...state, data: userData };
    case getType(unfollow):
      userData = state.data.user;
      userData.followings = userData.followings.filter(
        (follow) => follow !== action.payload
      );
      return { ...state, data: userData };
    case getType(upadateProfilePicture):
      userData = state.data.user;
      userData.profilePicture = action.payload;
      return { ...state, data: userData };
    case getType(logOut):
      localStorage.removeItem("token");
      return {
        ...state,
        data: null,
      };
    default:
      return state;
  }
}
