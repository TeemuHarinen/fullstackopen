import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS } from './components/queries'

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
  const resultAuthors = useQuery(ALL_AUTHORS, {
    pollInterval: 2000
  })

  const resultBooks = useQuery(ALL_BOOKS,{
    pollInterval: 2000
  })

  if (resultAuthors.loading)  {
    return <div>loading...</div>
  }
  if (resultBooks.loading)  {
    return <div>loading...</div>
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
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} authors={resultAuthors.data.allAuthors}/>
      <Books show={page === 'books'} books={resultBooks.data.allBooks}/>
      <NewBook show={page === 'add'} setError={notify} authors={resultAuthors.data.allAuthors}/>
    </div>
  )
}

export default App
