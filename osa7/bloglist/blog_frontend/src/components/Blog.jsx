import { useState } from "react"
import { useDispatch } from "react-redux"
import { setBlogs } from "../reducers/blogReducer"
import blogService from "../services/blogs"

const Blog = ({ blog, user, updateLike }) => {
  const dispatch = useDispatch()
  const [showFull, setShowFull] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleFull = () => {
    setShowFull(!showFull)
  }

  const removeBlog = async (blogToDelete) => {
    if (window.confirm(`Remove blog ${blogToDelete.title}?`)) {
      await blogService.remove(blogToDelete.id)
      const updatedBlogs = await blogService.getAll()
      dispatch(setBlogs(updatedBlogs))
    }
  }
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
        {blog.title}
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
  }
}
export default Blog
