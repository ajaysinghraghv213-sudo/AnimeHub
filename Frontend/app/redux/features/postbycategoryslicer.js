import { createSlice } from "@reduxjs/toolkit";


const postbycategorySlice = createSlice({
    name: "postbycategory",
    initialState: {
        posts: [],
        loading: true,
        error: null,
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setPosts, setLoading, setError } = postbycategorySlice.actions;
export default postbycategorySlice.reducer;