import {configureStore} from '@reduxjs/toolkit'
import postsReducer from './slices/postSlice'
import appConfigReducer from './slices/appConfigSlice'
import feedDataReducer from './slices/feedDataSlice'
export default configureStore({
    reducer: {
        appConfigReducer,
        postsReducer,
        feedDataReducer
    }
}) 