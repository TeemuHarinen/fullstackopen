import { createSlice } from '@reduxjs/toolkit'

const notificationReducer = createSlice({
  name: "notification",
  initialState: '',
  reducers: {
    voteNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { voteNotification, clearNotification } = notificationReducer.actions
export default notificationReducer.reducer