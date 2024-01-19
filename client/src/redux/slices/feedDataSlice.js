import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'; 
import { axiosClient } from '../../utils/axiosClient';
import { likeAndUnlikePost } from './postSlice';



export const getFeedData = createAsyncThunk('user/getFeedData', async (body) => {
    try {
        const response = await axiosClient.get('/user/getFeedData',body)
        return response.result;
    } catch (e) {
        return Promise.reject(e);
    }
})

export const followAndUnfollow = createAsyncThunk('user/followAndUnfollow', async (body) => {
    try {
        const response = await axiosClient.post('/user/follow',body)
        return response.result.user;
    } catch (e) {
        return Promise.reject(e);
    }
})




const feedSlice = createSlice({
    name: 'feedSlice',
    initialState: {
        feedData: {}
    },
    extraReducers: (builder) => {
        builder.addCase(getFeedData.fulfilled, (state,action) => {
            state.feedData = action.payload
        }).addCase(likeAndUnlikePost.fulfilled, (state,action) => {
            const post = action.payload
            const index = state.feedData?.posts?.findIndex((item) => item._id === post._id)
            if( index != -1 && index != undefined){
                state.feedData.posts[index] = post;
            }

        }).addCase(followAndUnfollow.fulfilled,(state,action)=> {
            const user = action.payload 
            const index = state?.feedData?.followings?.findIndex((item) => item._id)
             if(index != -1){
                state.feedData?.followings?.splice(index,1);
             }
             else{
                state.feedData?.following?.push(user)
             }
        })
    }
    }

)


export default feedSlice.reducer;
