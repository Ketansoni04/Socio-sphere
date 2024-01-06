import {configureStore} from '@reduxjs/toolkit'
import PostReducer from './slices/postSlice'
import appConfigReducer from './slices/appConfigSlice'
import feedDataReducer from './slices/feedDataSlice'
export default configureStore({
    reducer: {
        appConfigReducer,
        PostReducer,
        feedDataReducer

    }
}) 