import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = useRef()
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => a.likes > b.likes ? 1 : -1) ) // Sorts blogs based on likes
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const Notification = ({ message, isError }) => {
    if (message === null) {return null}

    const errorType = isError ? 'errorMessage' : 'successMessage'
    return (
      <div className={errorType}>
        {message}
      </div>
    )
  }

  const createBlog = async (newBlog) => {
    try {
      await blogService.create(newBlog)
      blogService.getAll()
        .then(blogs => setBlogs( blogs.sort((a, b) => a.likes > b.likes ? 1 : -1) ))
      blogFormRef.current.toggleVisibility()
      setSuccessMessage(`Blog created successfully: ${newBlog.title}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage(error.response.data)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateLike = async (blog) => {
    const newData = { ...blog, likes: blog.likes+1 }
    await blogService.update(blog.id, newData)

    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a, b) => a.likes > b.likes ? 1 : -1)) // Sorts blogs by likes
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (err) {
      setErrorMessage(err.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={successMessage} isError={false} />
      <Notification message={errorMessage} isError={true} />

      {!user && <Togglable buttonLabel="Log in">
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </Togglable> }
      {user && <h4> {user.name} logged in <button onClick={handleLogout}> logout </button> </h4>}
      {user && blogs.map(blog => <Blog key={blog.id} blog={blog} setBlogs={setBlogs} updateLike={updateLike} user={user}></Blog>)}
      {user && <Togglable buttonLabel="Add blog" ref={blogFormRef}>
        <BlogForm
          createBlog={createBlog}
        />
      </Togglable> }
    </div>
  )
}


export default App