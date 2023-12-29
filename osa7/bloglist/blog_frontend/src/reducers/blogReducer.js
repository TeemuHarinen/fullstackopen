import { createSlice } from "@reduxjs/toolkit"

const blogReducer = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    // more reducers could be used but backend already handles most actions
    setBlogs: (state, action) => {
      return action.payload
    },
    addComment: (state, action) => {
      const { id, comment } = action.payload
      const blog = state.find((blog) => blog.id === id)
      if (blog) {
        blog.comments.push(comment)
      }
    },
  },
})

export const { setBlogs, addComment } = blogReducer.actions
export default blogReducer.reducer
