import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery, useApolloClient } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, ME } from './components/queries'
import LoginForm from './components/LoginForm'
import FavoriteList from './components/FavoriteList'

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const userResult = useQuery(ME)

  // Function from "terikihuan" on fullstackopen discord server
  useEffect(() => {
    setToken(localStorage.getItem("books-user-token") || null)
    userResult.startPolling(500)
    setTimeout(() => {
      userResult.stopPolling()
    }, 3000)
  }, [token])


  const resultAuthors = useQuery(ALL_AUTHORS, {
    pollInterval: 1000
  })

  const resultBooks = useQuery(ALL_BOOKS,{
    pollInterval: 1000  })

  if (resultAuthors.loading)  {
    return <div>loading...</div>
  }
  if (resultBooks.loading)  {
    return <div>loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Notify errorMessage={errorMessage}/>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('favorite')}>favorite</button>}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors show={page === 'authors'} authors={resultAuthors.data.allAuthors}/>
      <Books show={page === 'books'} books={resultBooks.data.allBooks}/>
      <NewBook show={page === 'add'} setError={notify} authors={resultAuthors.data.allAuthors}/>
      <FavoriteList show={page === 'favorite'} favoriteBooks={resultBooks.data.allBooks}/>
      <LoginForm show={page === 'login'} setError={notify} setToken={setToken} setPage={setPage}/>
    </div>
  )
}

export default App
