import { createSlice } from "@reduxjs/toolkit"

const blogReducer = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs: (state, action) => {
      // more reducers could be used but backend already handles most actions (updates etc.)
      return action.payload
    },
  },
})

export const { setBlogs } = blogReducer.actions
export default blogReducer.reducer
