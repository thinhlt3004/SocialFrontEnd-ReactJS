const AuthReducer = (state, action) =>{
    switch(action.type){
        case 'FOLLOW':
            return{
               ...state, user: {
                   ...state.user,
                   followings: [...state.user.followings, action.payload]
               }
            };
        case 'UPDATEPROFILEPICTURE':
            return{
                ...state, user: {
                    ...state.user, profilePicture:  action.payload
                }
            };
        case 'UNFOLLOW':
            return{
                ...state, user: {
                     ...state.user,
                        followings: state.user.followings.filter(following => following !== action.payload)
                    }
                };
        case 'GETMESSAGE':
            return {...state, message: action.payload};
        case 'REMOVEMESSAGE':
            return {...state, message: null};
        default:
            return state; 
    }
}

export default AuthReducer;