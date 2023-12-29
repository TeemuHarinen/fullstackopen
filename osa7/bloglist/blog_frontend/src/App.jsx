import { useState, useEffect } from "react"
import Blogs from "./components/Blogs"
import Users from "./components/Users"
import User from "./components/User"
import BlogSingle from "./components/BlogSingle"
import blogService from "./services/blogs"
import loginService from "./services/login"
import LoginForm from "./components/LoginForm"
import Togglable from "./components/Togglable"
import Notification from "./components/Notification"
import { useSelector, useDispatch } from "react-redux"
import {
  clearNotification,
  setNotification,
} from "./reducers/notificationReducer"
import { setBlogs } from "./reducers/blogReducer"
import { setUser, clearUser } from "./reducers/loggedUserReducer"
import { Routes, Route, Link, useMatch } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import { Navbar, Nav, Button } from "react-bootstrap"

const App = () => {
  const dispatch = useDispatch()
  const match = useMatch("/users/:id")
  const matchInd = useMatch("/blogs/:id")
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
    blogService
      .getAll()
      .then((blogs) =>
        dispatch(setBlogs(blogs.sort((a, b) => (a.likes < b.likes ? 1 : -1)))),
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
    padding: 5,
  }

  const matchedBlogs = match
    ? blogs.filter((b) => b.user.id === match.params.id)
    : null
  const matchedBlog = matchInd
    ? blogs.find((b) => b.id === matchInd.params.id)
    : null

  return (
    <div className="container">
      <Notification></Notification>
      {user && (
        <div>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav>
                <Nav.Link as="span">
                  <Link style={padding} to="/">
                    blogs
                  </Link>
                </Nav.Link>
                <Nav.Link as="span">
                  <Link style={padding} to="/users">
                    users
                  </Link>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <br />
            {user.name} logged in <Button onClick={handleLogout}>logout</Button>
        </div>
      )}
      <h2>Blogs</h2>
      <br />
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
        <Route path="/users/:id" element={<User blogs={matchedBlogs} />} />
        <Route path="/blogs/:id" element={<BlogSingle blog={matchedBlog} />} />
      </Routes>
    </div>
  )
}

export default App
