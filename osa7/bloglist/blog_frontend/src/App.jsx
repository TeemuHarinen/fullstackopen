import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import LoginForm from "./components/LoginForm"
import BlogForm from "./components/BlogForm"
import Togglable from "./components/Togglable"
import Notification from "./components/Notification"
import { useSelector, useDispatch } from "react-redux"
import {
  clearNotification,
  setNotification,
} from "./reducers/notificationReducer"
import { setBlogs } from "./reducers/blogReducer"
import { setUser, clearUser } from "./reducers/loggedUserReducer"
import {
  Routes, Route, Link, useNavigate, useMatch
} from 'react-router-dom'

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
      dispatch(setNotification({ message: error.response.data, type: "error" }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }
  }

  const updateLike = async (blog) => {
    const newData = { ...blog, likes: blog.likes + 1 }
    await blogService.update(blog.id, newData)

    const updatedBlogs = await blogService.getAll()
    dispatch(
      setBlogs(updatedBlogs.sort((a, b) => (a.likes < b.likes ? 1 : -1))),
    ) // Sorts blogs by likes
  }

  return (
    <div>
      {user &&
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateLike={updateLike}
            user={user}
            className="blog"
          ></Blog>
        ))}
      {user && (
        <Togglable buttonLabel="Add blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>
      )}
    </div>
  )
}

const Users = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.loggedUser)
  const authors = blogs.map(blog => ({ name: blog.user.name, id: blog.user.id }))
  const uniqueAuthors = authors.filter((author, index, self) =>
  index === self.findIndex((a) => a.id === author.id))
  console.log(blogs)
  //<Link to={`/users/${blog.id}`}>
  if (!user) return null
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {uniqueAuthors.map(author => (
            <tr key={author.id}>
              <td><Link to={`/users/${author.id}`}>{author.name}</Link></td>
              <td>{blogs.filter(blog => blog.user.id === author.id).length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const User = ({ user }) => {
  console.log(user)
  return (
    <div></div>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const user = useSelector((state) => state.loggedUser)
  const blogs = useSelector((state) => state.blogs)
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  useEffect(() => {
    blogService.getAll().then(
      (blogs) =>
        dispatch(setBlogs(blogs.sort((a, b) => (a.likes < b.likes ? 1 : -1)))), // Sorts blogs based on likes
    )
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername("")
      setPassword("")
    } catch (err) {
      dispatch(
        setNotification({ message: err.response.data.error, type: "error" }),
      )
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser")
    dispatch(clearUser())
  }

  const padding = {
    padding: 5
  }

  const match = useMatch('/users/:id')
  const foundUser = match
    ? blogs.find(b => b.user.id === Number(match.params.id))
    : null

  return (
    <div>
      <h2>Blogs</h2>
      <Notification></Notification>
      {user && (
        <div>
          <Link style={padding} to="/">blogs</Link>
          <Link style={padding} to="/users">users</Link>
          <h4>
          {" "}
          {user.name} logged in <button onClick={handleLogout}> logout </button>{" "}
          </h4>
        </div>
        )
      }
      
      {!user && (
        <Togglable buttonLabel="Log in">
          <LoginForm
            handleSubmit={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
        </Togglable>
      )}

      <Routes>
        <Route path="/" element={<Blogs></Blogs>}></Route>
        <Route path="/users" element={<Users></Users>}></Route>
        <Route path="/users/:id" element={<User user={foundUser} />} />
      </Routes>
    </div>
  )
}

export default App
