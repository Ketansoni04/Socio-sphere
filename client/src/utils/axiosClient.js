import axios from "axios";
import { getItem, KEY_ACCESS_TOKEN, removeItem,setItem } from "./LocalStorageManager";

export const axiosClient = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_BASE_URL}`,
    withCredentials: true
})

axiosClient.interceptors.request.use(
      (request) => {
        const accessToken =  getItem(KEY_ACCESS_TOKEN);
        request.headers["Authorization"] = `Bearer ${accessToken}`;

        return request;
    }
)

axiosClient.interceptors.response.use(
    async (response) => {
        const data = await response.data;
        if (data.status === 'ok') {
            return data;
        }

        const originalRequest =  response.config;
        const statusCode = await data.statusCode;
        const error = await data.message;

        if (statusCode === 401 && originalRequest.url === `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
        ) {
            removeItem(KEY_ACCESS_TOKEN);
            window.location.replace('/login', '_self')
            return Promise.reject(error)
        }
    
        if (statusCode === 401) {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`)
            console.log('response the log', response)

            if (response.status === 'ok') {

                setItem(KEY_ACCESS_TOKEN, response.result.accessToken)
                originalRequest.headers['Authorization'] = `Bearer ${response.result.accessToken}`
                return axios(originalRequest);
            }
        }

        return Promise.reject(error)

    }
)

