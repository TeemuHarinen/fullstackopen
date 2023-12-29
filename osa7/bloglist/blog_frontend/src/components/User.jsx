import React from "react"
import { useSelector } from "react-redux"

const User = ({ blogs }) => {
  const user = useSelector((state) => state.loggedUser)
  if (!blogs || !blogs[0] || !blogs[0].user || !user) {
    return null
  }

  return (
    <div>
      <h2>{blogs[0].user.name}</h2>
      <h4>Added blogs</h4>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
