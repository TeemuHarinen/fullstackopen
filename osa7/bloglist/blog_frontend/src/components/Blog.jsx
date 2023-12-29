import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setBlogs } from "../reducers/blogReducer"
import blogService from "../services/blogs"
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom"

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.loggedUser)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  if (!blog || !user) return null
  return (
    <div style={blogStyle} className="blog">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </div>
  )
}
export default Blog

/*
if (showFull === false) {
    return (
      <div style={blogStyle} className="blog">
        {blog.title} {blog.author}
        <button onClick={() => toggleFull()} className="viewButton">
          {" "}
          View{" "}
        </button>
      </div>
    )
  } else {
    return (
      <div style={blogStyle} className="fullBlog">
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        <button onClick={() => toggleFull()}> Hide </button> <br></br>
        {blog.url} <br></br>
        {blog.likes}{" "}
        <button onClick={() => updateLike(blog)} className="likeButton">
          {" "}
          like{" "}
        </button>
        <br></br>
        {blog.author} <br></br>
        {blog.user.username === user.username && (
          <button onClick={() => removeBlog(blog)}>remove</button>
        )}
      </div>
    )
    const removeBlog = async (blogToDelete) => {
    if (window.confirm(`Remove blog ${blogToDelete.title}?`)) {
      await blogService.remove(blogToDelete.id)
      const updatedBlogs = await blogService.getAll()
      dispatch(setBlogs(updatedBlogs))
    }
  }
*/
