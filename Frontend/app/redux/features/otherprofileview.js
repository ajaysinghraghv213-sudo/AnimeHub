import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { otherProfileView } from '../../function/profileview';

/**
 * @param {string} userId
 */
const loadOtherProfile = async (userId) => {
    return otherProfileView(userId);
};

export const fetchOtherProfileView = createAsyncThunk(
    'otherProfileView/fetchOtherProfileView',
    loadOtherProfile
);

const otherProfileViewSlice = createSlice({
    name: 'otherProfileView',
    initialState: {
        profile: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOtherProfileView.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOtherProfileView.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchOtherProfileView.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            });
    },
});

export default otherProfileViewSlice.reducer;
export const selectOtherProfileView = (state) => state.otherProfileView;