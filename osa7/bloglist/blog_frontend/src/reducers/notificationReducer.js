import { createSlice } from "@reduxjs/toolkit"

const notificationReducer = createSlice({
  name: "notification",
  initialState: { message: "", type: "" },
  reducers: {
    setNotification(state, action) {
      state.message = action.payload.message
      state.type = action.payload.type
    },
    clearNotification(state) {
      state.message = ""
      state.type = ""
    },
  },
})

export const { clearNotification, setNotification } =
  notificationReducer.actions
export default notificationReducer.reducer
