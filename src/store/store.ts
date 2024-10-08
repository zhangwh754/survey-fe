import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userReducer'
import pageReducer from './pageReducer'
import componentReducer from './component/componentReducer'

export const store = configureStore({
  reducer: {
    user: userReducer,
    component: componentReducer,
    page: pageReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
