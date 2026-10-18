import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    categoryId: null,
    error: null,
  },
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setCategoryId(state, action) {
      state.categoryId = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setCategories, setCategoryId, setError } = categorySlice.actions;
export default categorySlice.reducer;