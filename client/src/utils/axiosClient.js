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
      (request) => {
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
        const statusCode =  data.statusCode;
        const error =  data.message;

        store.dispatch(showToast({
            type: TOAST_FAILURE,
            message : error
        }))

        if (statusCode == 401 && !originalRequest.url) {
            
            originalRequest._retry = true;
            const response = await axios.create({
                withCredentials: true,
            }).get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`)
            console.log('response the log', response)

            if (response.data.status === 'ok') {

                setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken)
                originalRequest.headers['Authorization'] = `Bearer ${response.data.result.accessToken}`
                return axios(originalRequest);
            }
        }

        if (statusCode === 401 && originalRequest.url == `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
        ) {
            removeItem(KEY_ACCESS_TOKEN);
            window.location.replace('/login', '_self')
            return Promise.reject(error)
        }
        

        return Promise.reject(error)

    }, async (error) => {
        store.dispatch(setLoading(false))
        store.dispatch(showToast({
            type: TOAST_FAILURE,
            message : error
        }))
        return Promise.reject(error)
    }
)

