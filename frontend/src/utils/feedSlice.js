import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => action.payload,
    removeFeedUser: (state, action) => {
      return state.filter((user) => {
        return user._id !== action.payload;
      });
    },
    removeFeed: (state, action) => null,
  },
});

export const { addFeed, removeFeed, removeFeedUser } = feedSlice.actions;
export default feedSlice.reducer;
