import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFollowers, addFollowers } from '@/app/function/getfollowers';

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

export const fetchFollowers = createAsyncThunk(
    'followers/fetchFollowers',
    /**
     * @param {string} [userId]
     */
    async (userId, { rejectWithValue }) => {
        try {
            return await getFollowers(userId);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to fetch followers'
            );
        }
    }
);


export const addFollowerAsync = createAsyncThunk(
    'followers/addFollower',
    async (followerId, { rejectWithValue }) => {
        try {
            return await addFollowers(followerId);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to add follower'
            );
        }
    }
);




const followersSlice = createSlice({
    name: 'followers',
    initialState,
    reducers: {
        setFollowers(state, action) {
            state.followers = action.payload;
        },
        setFollowing(state, action) {
            state.following = action.payload;
        },
        addFollower(state, action) {
            state.followers.push(action.payload);
        },
        removeFollower(state, action) {
            state.followers = state.followers.filter(
                (follower) => follower.id !== action.payload
            );
        },
        clearFollowers(state) {
            state.followers = [];
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollowers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFollowers.fulfilled, (state, action) => {
                const data = action.payload;

                state.loading = false;
                state.error = null;
                state.followers = Array.isArray(data)
                    ? getUsersFromRelationships(data, 'follower')
                    : getUsersFromRelationships(data?.follower, 'follower');
                state.following = Array.isArray(data)
                    ? []
                    : getUsersFromRelationships(data?.following, 'following');
            })
            .addCase(fetchFollowers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to fetch followers';
            })
            .addCase(addFollowerAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFollowerAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.followers.push(action.payload);
            })
            .addCase(addFollowerAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to add follower';
            });
    },
});

export const {
    setFollowers,
    setFollowing,
    addFollower,
    removeFollower,
    clearFollowers,
    setError,
} = followersSlice.actions;

export default followersSlice.reducer;