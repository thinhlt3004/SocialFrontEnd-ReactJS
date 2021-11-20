import { takeLatest, call, put } from "redux-saga/effects";
import * as api from './../../api/index';
import * as authActions from './../actions/authActions';
function* checkSignIn(action) {
  try {
    const res = yield call(api.Login, action.payload);
    if (res.status === 200) {
      if (localStorage.getItem("token") !== null) {
        localStorage.removeItem("token");
      }
      const token = {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      };
      localStorage.setItem("token", JSON.stringify(token));
      yield put(authActions.getUser.getUserSuccess(res.data.user));

    }
  } catch (error) {
    console.log(error);
    yield put(authActions.getUser.getUserFailure(error));
  }
}

function* refreshLogin(action) {
  try {
    const res = yield call(api.GetUserByToken);
    yield put(authActions.refreshLogin.refreshLoginSuccess(res.data.user));
  } catch (error) {
    console.log(error);
    yield put(authActions.refreshLogin.refreshLoginFailure(error));
  }
}

function* mySaga() {
    yield takeLatest(authActions.getUser.getUserRequest, checkSignIn);
    yield takeLatest(authActions.refreshLogin.refreshLoginRequest, refreshLogin);
}

export default mySaga;