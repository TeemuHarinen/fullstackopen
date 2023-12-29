import { configureStore } from "@reduxjs/toolkit"

import notificationReducer from "./reducers/notificationReducer"
import blogReducer from "./reducers/blogReducer"
import loggedUserReducer from "./reducers/loggedUserReducer"
const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    loggedUser: loggedUserReducer,
  },
})

export default store
