
import { createSlice } from '@reduxjs/toolkit';



const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
    },
    reducers: {
        setComments: (state, action) => {
            state.comments = action.payload;
        },
        addComment: (state, action) => {
            state.comments.push(action.payload);
        },
        removeComment: (state, action) => {
            state.comments = state.comments.filter(comment => comment.id !== action.payload);
        },
    },
});

export const { setComments, addComment, removeComment } = commentsSlice.actions;
export default commentsSlice.reducer;