import axios from "axios";
import jwt_decode from "jwt-decode";

export const axiosJWT = axios.create();
axiosJWT.interceptors.request.use(
  async (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    //console.log(token.accessToken);
    let currentDate = new Date();
    const decodedToken = jwt_decode(token.accessToken);
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      const data = await refreshToken();
      config.headers["Authorization"] = "Bearer " + data.accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.post("/auth/refresh", {
      token: token.refreshToken,
    });
    const tokens = {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    };
    if (localStorage.getItem("token") !== null) {
      localStorage.removeItem("token");
    }
    localStorage.setItem("token", JSON.stringify(tokens));
    return tokens;
  } catch (err) {
    console.log(err);
  }
};


export const Login = (payload) =>  axios.post("/auth/login", payload);

export const GetUserByToken = () => axiosJWT.get('/auth/get', {
  headers: {Authorization :`Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`}
});


export const GetAllUsers = () => axiosJWT.get('/users/getall', {
  headers: {Authorization :`Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`}
});


export const getPostbyID = (payload) => axiosJWT.get('/posts/' + payload);