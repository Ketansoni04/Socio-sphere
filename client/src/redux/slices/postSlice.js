import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'; 
import { axiosClient } from '../../utils/axiosClient';
import { setLoading } from './appConfigSlice';



export const getUserProfile = createAsyncThunk('user/getMyInfo', async (body,thunkAPI) => {
    try {
        thunkAPI.dispatch(setLoading(true))
        const response = await axiosClient.post('/user/getUserProfile',body)
        return response.result;
    } catch (e) {
        return Promise.reject(e);
    }
    finally{
        thunkAPI.dispatch(setLoading(false))
    }
})

export const likeAndUnlikePost = createAsyncThunk("post/likeAndUnlike", async (body,thunkAPI) => {
    try {
        thunkAPI.dispatch(setLoading(true))
        const response = await axiosClient.post('/post/like',body)
        return response.result.post;
    } catch (e) {
        return Promise.reject(e);
    }
    finally{
        thunkAPI.dispatch(setLoading(false))
    }
})



const postSlice = createSlice({
    name: 'postSlice',
    initialState: {
        isLoading: false,
        userProfile:{}
    },
    extraReducers: (builder) => {
        builder.addCase(postSlice.fulfilled, (state,action) => {
            state.userProfile = action.payload
        }).addCase(likeAndUnlikePost.fulfilled, (state,action) => {
            const post = action.payload
            const index = state.userProfile.post.findIndex(item => item._id === post._id)
            if( index !== -1 &&  index !== undefined){
                state.userProfile.posts[index] = post;
            }

        })
    }
    }

)


export default postSlice.reducer;
