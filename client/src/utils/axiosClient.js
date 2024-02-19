import axios from "axios";
import { getItem, KEY_ACCESS_TOKEN, removeItem,setItem } from "./LocalStorageManager";
import store from '../redux/store'
import { TOAST_FAILURE } from "../App";
import { setLoading, showToast } from '../redux/slices/appConfigSlice'

let baseURL = 'http://localhost:4000/';
console.log('env is ', process.env.NODE_ENV);
if(process.env.NODE_ENV === 'production') {
    baseURL = process.env.REACT_APP_SERVER_BASE_URL
}
export const axiosClient = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_BASE_URL}`,
    withCredentials: true
})

axiosClient.interceptors.request.use(
      async (request) => {
        const accessToken =  getItem(KEY_ACCESS_TOKEN);
        request.headers["Authorization"] = `Bearer ${accessToken}`;
        store.dispatch(setLoading(true))

        return request;
    }
)

axiosClient.interceptors.response.use(
    async (response) => {
        store.dispatch(setLoading(false))
        const data = await response.data;
        if (data.status === "ok") {
            return data;
        }

        const originalRequest =  response.config;
        console.log(originalRequest);
        const statusCode =  data.statusCode;
        const error =  data.message;

        store.dispatch(showToast({
            type: TOAST_FAILURE,
            message : error
        }))

        if (statusCode === 401 && !originalRequest._retry) {  
            originalRequest._retry = true;
            
            const response1 = await axios.create({
                withCredentials: true,
            }).get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`)
            console.log(response1);
            if (response1.data.status === "ok") {
               setItem(KEY_ACCESS_TOKEN, response1.data.result.accessToken)
               const accessToken1 =  getItem(KEY_ACCESS_TOKEN);
               console.log(accessToken1);
               console.log(response1);
                originalRequest.headers['Authorization'] = `Bearer ${response1.data.result.accessToken}`
                try {
                    return axios(originalRequest) 
                }
                catch(e) {
                    console.log(e);
                }
            }
        }

        if (statusCode === 401 && originalRequest.url == `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
        ) {
            removeItem(KEY_ACCESS_TOKEN);
            window.location.replace('/login', '_self')
            return Promise.reject(error)
        }else{
            return Promise.reject(error)
        }
        

    }, async (error) => {
        console.log(error);
        store.dispatch(setLoading(false))
        store.dispatch(showToast({
            type: TOAST_FAILURE,
            message : error
        }))
        return Promise.reject(error)
    }
)

