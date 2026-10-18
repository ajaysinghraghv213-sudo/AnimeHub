import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./features/categoryslicer"; 
import commentsReducer from "./features/comments"; 
import postbycategoryReducer from "./features/postbycategoryslicer"; 
import followersReducer from "./features/followers";
import otherProfileViewReducer from "./features/otherprofileview";
import otherFollowersReducer from "./features/otherfollowers";



const store = configureStore({
  reducer: {
    category: categoryReducer,
    comments: commentsReducer,
    postbycategory: postbycategoryReducer,
    followers: followersReducer,
    otherProfileView: otherProfileViewReducer,
    otherFollowers: otherFollowersReducer,
  },
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;