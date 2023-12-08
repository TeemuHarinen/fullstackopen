import Filter from './components/Filter'
import AnecdoteFrom from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {
  return (
    <div>
      <h1> Anecdotes </h1>
      <Notification></Notification>
      <Filter></Filter>
      <AnecdoteFrom></AnecdoteFrom>
      <AnecdoteList></AnecdoteList>
    </div>
  )
}

export default App