import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getothersFollowers } from '@/app/function/getfollowers';

export const initialState = {
    followers: [],
    following: [],
    loading: false,
    error: null,
};

const getUsersFromRelationships = (items, userKey) => {
    if (!Array.isArray(items)) return [];

    return items.map((item) => item?.[userKey] ?? item);
};

export const fetchOtherFollowers = createAsyncThunk(
    'otherFollowers/fetchOtherFollowers',
    /**
     * @param {string} userId
     */
    async (userId, { rejectWithValue }) => {
        try {
            return await getothersFollowers(userId);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to fetch followers'
            );
        }
    }
);

const otherFollowersSlice = createSlice({
    name: 'otherFollowers',
    initialState,
    reducers: {
        clearOtherFollowers(state) {
            state.followers = [];
            state.following = [];
            state.error = null;
            state.loading = false;
        },
        addFollower(state, action) {
            if (!state.followers.some((follower) => String(follower?.id) === String(action.payload?.id))) {
                state.followers.push(action.payload);
            }
        },
        removeOtherFollower(state, action) {
            state.followers = state.followers.filter(
                (follower) => String(follower?.id) !== String(action.payload)
            );
        },
        addFollowing(state, action) {
            state.following.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOtherFollowers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOtherFollowers.fulfilled, (state, action) => {
                const data = action.payload;

                state.loading = false;
                state.error = null;
                state.followers = getUsersFromRelationships(data?.follower, 'follower');
                state.following = getUsersFromRelationships(data?.following, 'following');
            })
            .addCase(fetchOtherFollowers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to fetch followers';
            });
    },
});

export const { clearOtherFollowers, addFollower, removeOtherFollower, addFollowing } = otherFollowersSlice.actions;

export default otherFollowersSlice.reducer;
