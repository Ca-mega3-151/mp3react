import { configureStore } from "@reduxjs/toolkit";
import playerSlice from "./player.slide";

const store = configureStore({
  reducer: {
    [playerSlice.name]: playerSlice.reducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
