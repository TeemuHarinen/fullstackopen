
import React, { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import BlogForm from "./BlogForm"
import Blog from "./Blog"
import Togglable from "./Togglable"
import { setBlogs } from "../reducers/blogReducer"
import { setNotification, clearNotification } from "../reducers/notificationReducer"
import blogService from "../services/blogs"


const Blogs = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const blogFormRef = useRef()
  const user = useSelector((state) => state.loggedUser)
  const createBlog = async (newBlog) => {
    try {
      await blogService.create(newBlog)
      blogService
        .getAll()
        .then((blogs) =>
          dispatch(
            setBlogs(blogs.sort((a, b) => (a.likes < b.likes ? 1 : -1))),
          ),
        )
      blogFormRef.current.toggleVisibility()
      dispatch(
        setNotification({
          message: `Blog created successfully: ${newBlog.title}`,
          type: "success",
        }),
      )
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } catch (error) {
      dispatch(
        setNotification({ message: error.response.data.error, type: "error" }),
      )
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }
  }

  return (
    <div>
      {user &&
        blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} user={user} className="blog"></Blog>
        ))}
      {user && (
        <Togglable buttonLabel="Add blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>
      )}
    </div>
  )
}

export default Blogs

