import {createActions, createAction} from 'redux-actions';



export const getType = (reduxAction) => {
    return reduxAction().type;
};
export const getUser = createActions({
    getUserRequest : (payload) => payload,
    getUserSuccess : (payload) => payload,
    getUserFailure : (error) => error,
});

export const refreshLogin = createActions({
    refreshLoginRequest : () => undefined,
    refreshLoginSuccess : (payload) => payload,
    refreshLoginFailure : (error) => error,
});

export const sendMessage = createAction('GET_MESSAGE', (payload) => payload);

export const removeMessage = createAction('DELETE_MESSAGE');

export const follow = createAction('FOLLOW_USER');

export const unfollow = createAction('UNFOLLOW_USER');

export const upadateProfilePicture = createAction('UPADATE_PROFILE_PHOTO', (payload) => payload);

export const logOut = createAction('LOG_OUT');
