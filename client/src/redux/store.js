import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js'

export const store = configureStore({
  reducer: {
    // Define your reducers here
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})