import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'; 
import { axiosClient } from '../../utils/axiosClient';
import { setLoading } from './appConfigSlice';
import { likeAndUnlikePost } from './postSlice';



export const getFeedData = createAsyncThunk('user/getFeedData', async (body,thunkAPI) => {
    try {
        thunkAPI.dispatch(setLoading(true))
        const response = await axiosClient.get('/user/getFeedData',body)
        return response.result;
    } catch (e) {
        return Promise.reject(e);
    }
    finally{
        thunkAPI.dispatch(setLoading(false))
    }
})

export const followAndUnfollow = createAsyncThunk('user/followAndUnfollow', async (body,thunkAPI) => {
    try {
        thunkAPI.dispatch(setLoading(true))
        const response = await axiosClient.get('/user/follow',body)
        return response.result.user;
    } catch (e) {
        return Promise.reject(e);
    }
    finally{
        thunkAPI.dispatch(setLoading(false))
    }
})




const feedSlice = createSlice({
    name: 'feedSlice',
    initialState: {
        feedData: {}
    },
    extraReducers: (builder) => {
        builder.addCase(feedSlice.fulfilled, (state,action) => {
            state.feedData = action.payload
        }).addCase(feedSlice.fulfilled, (state,action) => {
            const post = action.payload
            const index = state.feedData?.post?.findIndex(item => item._id === post._id)
            if( index !== -1 && index !== undefined){
                state.feedData?.posts[index] = post;
            }

        }).addCase(followAndUnfollow.fulfilled,(state,action)=> {
            const user = action.payload 
            const index = state?.feedData?.followings.findIndex(item => item._id)
             if(index !== -1){
                state?.feedData.followings.splice(index,1);
             }
             else{
                state?.feedData.following.push(user)
             }
        })
    }
    }

)


export default feedSlice.reducer;
