
import AnecdoteFrom from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'

const App = () => {
  return (
    <div>
      <h1> Anecdotes </h1>
      <AnecdoteFrom></AnecdoteFrom>
      <Filter></Filter>
      <AnecdoteList></AnecdoteList>
    </div>
  )
}

export default App