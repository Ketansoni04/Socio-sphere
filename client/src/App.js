import Login from "./pages/login/Login";
import { Routes, Route } from 'react-router-dom'
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import RequireUser from "./components/RequireUser";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";
import Feed from './components/Feed/Feed'
import Post from './components/Posts/Post'
import Profile from './components/Profile/Profile'
import {useSelector} from 'react-redux'
import LoadingBar from 'react-top-loading-bar'
import OnlyIfNotLoggedIn from "./components/OnlyIfNotLoggedIn";
import React,{useRef,useEffect} from "react";
import toast, { Toaster } from 'react-hot-toast';

export const TOAST_SUCCESS = 'toast_success'
export const TOAST_FAILURE = 'toast_failure'


function App() {
    const isLoading = useSelector(state => state.appConfigReducer.isLoading)
    const toastData = useSelector(state => state.appConfigReducer.toastData)
    const loadingRef = useRef(null)
    


    useEffect(() => {
        if(isLoading){
            loadingRef.current?.continuousStart();
        }
        else{
            loadingRef.current?.complete();
        }
    },[isLoading])


    useEffect(() => {
        switch (toastData.type) {
            case TOAST_SUCCESS:
                toast.success(toastData.message)
                break;
            case TOAST_FAILURE:
                toast.error(toastData.message)
                break;
        }
        },[toastData])

    return (

        <div className="App">
            <LoadingBar ref={loadingRef} color='#000'/>
            <div><Toaster/></div>
            <Routes>
                <Route element={<RequireUser />}>
                    <Route path='/' element={<Home />} >
                        <Route path="/" element={<Feed />} />
                        <Route path="/post" element={<Post />} />
                        <Route path="/profile/:userId" element={<Profile />} />
                        <Route path="/profile/:userId/updateProfile" element={<UpdateProfile />} />
                    </Route>
                    
                </Route>
                <Route element={<OnlyIfNotLoggedIn />} >
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                </Route>
            </Routes>
        </div>

    );
}

export default App;
