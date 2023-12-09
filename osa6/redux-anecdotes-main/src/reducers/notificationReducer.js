import { createSlice } from '@reduxjs/toolkit'

const notificationReducer = createSlice({
  name: "notification",
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const voteNotification = (content, time) => {
  return dispatch => {
    dispatch(setNotification(content))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time * 1000)
  }
}

export const { clearNotification, setNotification } = notificationReducer.actions
export default notificationReducer.reducer