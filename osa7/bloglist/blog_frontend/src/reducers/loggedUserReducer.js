import { createSlice } from "@reduxjs/toolkit"

const loggedUserReducer = createSlice({
  name: "blogs",
  initialState: null,
  reducers: {
    setUser: (state, action) => {
      return action.payload
    },
    clearUser: (state, action) => {
      return null
    },
  },
})

export const { setUser, clearUser } = loggedUserReducer.actions
export default loggedUserReducer.reducer
