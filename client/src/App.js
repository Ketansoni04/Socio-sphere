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

function App() {
    const isLoading = useSelector(state => state.appConfigReducer.isLoading)

    const loadingRef = useRef(null)
    useEffect(() => {
        if(isLoading){
            loadingRef.current?.continuousStart();
        }
        else{
            loadingRef.current?.complete();
        }
    },[isLoading])

    return (

        <div className="App">
            <LoadingBar ref={loadingRef} color='#000'/>
            <Routes>
                <Route element={<RequireUser />}>
                    <Route path='/' element={<Home />} >
                        <Route path="/" element={<Feed />} />
                        <Route path="/post" element={<Post />} />
                        <Route path="/profile/:userId" element={<Profile />} />
                        <Route path="/updateProfile" element={<UpdateProfile />} />
                    </Route>
                </Route>
                <Routes element={<OnlyIfNotLoggedIn />} >
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                </Routes>
            </Routes>
        </div>

    );
}

export default App;
