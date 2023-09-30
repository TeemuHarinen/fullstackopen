import {useState} from 'react'
import blogService from '../services/blogs'



const Blog = ({ blog, setBlogs, user }) => {
  const [showFull, setShowFull] = useState(false)
  console.log(user)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleFull = () => {
    setShowFull(!showFull)
  }

  const updateLike = async (blog) => {
    const newData = {...blog, likes: blog.likes+1}
    await blogService.update(blog.id, newData)

    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a, b) => a.likes > b.likes ? 1 : -1)) // Sorts blogs by likes
  }
  
  const removeBlog = async (blogToDelete) => {
    await blogService.remove(blogToDelete.id)
    console.log(blogToDelete.user.id)
  }
  if (showFull === false) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={() => toggleFull()}> View </button>
      </div>  
    )
  } else {
    return (
      <div style={blogStyle}>
        {blog.title} 
        <button onClick={() => toggleFull()}> Hide </button> <br></br>
        {blog.url} <br></br>
        {blog.likes} <button onClick={() => updateLike(blog)}> like </button><br></br>
        {blog.author} <br></br>
        {blog.user.id === user.id && <button onClick={() => removeBlog(blog)}>remove</button>}
      </div>
    )
  }
}
export default Blog