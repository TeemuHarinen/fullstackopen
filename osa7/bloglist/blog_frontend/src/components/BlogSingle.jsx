import axios from "axios"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addComment } from "../reducers/blogReducer"
import { setBlogs } from "../reducers/blogReducer"
import blogService from "../services/blogs"

const BlogSingle = ({ blog }) => {
  const user = useSelector((state) => state.loggedUser)
  const [comment, setComment] = useState("")
  const dispatch = useDispatch()
  if (!blog || !user) {
    return null
  }

  const updateLike = async (blog) => {
    const newData = { ...blog, likes: blog.likes + 1 }
    await blogService.update(blog.id, newData)
    const updatedBlogs = await blogService.getAll()
    dispatch(setBlogs(updatedBlogs))
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    const comment = event.target[0].value
    axios.post(`http://localhost:3003/api/blogs/${blog.id}/comments`, {
      comment,
    })
    dispatch(addComment({ id: blog.id, comment: comment }))
    setComment("")
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </p>
      <p>
        {blog.likes} <button onClick={() => updateLike(blog)}>like</button>
      </p>
      <p>added by {blog.author}</p>
      <h4>Comments</h4>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogSingle
