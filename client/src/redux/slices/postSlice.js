import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'; 
import { axiosClient } from '../../utils/axiosClient';


export const getUserProfile = createAsyncThunk('user/getUserProfile', async (body) => {
    try {
        const response = await axiosClient.post('/user/getUserProfile',body)
        return response.result;
    } catch (e) {
        return Promise.reject(e);
    }
})

export const likeAndUnlikePost = createAsyncThunk("post/likeAndUnlike", async (body) => {
    try {
        const response = await axiosClient.post('/posts/like',body)
        return response.result.post;
    } catch (e) {
        return Promise.reject(e);
    }
})



const postSlice = createSlice({
    name: 'postSlice',
    initialState: {
        userProfile:{}
    },
    extraReducers: (builder) => {
        builder.addCase(getUserProfile.fulfilled, (state,action) => {
            state.userProfile = action.payload
        }).addCase(likeAndUnlikePost.fulfilled, (state,action) => {
            const post = action.payload
            const index = state?.userProfile?.post?.findIndex((item) => item._id === post._id)
            if( index != -1 &&  index != undefined){
                state.userProfile.posts[index] = post;
            }

        })
    }
    }

)


export default postSlice.reducer;
