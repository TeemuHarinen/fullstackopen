import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteFrom = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }

  return (
    <>
    <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name="anecdote"/>
        <button type="submit">create</button>
      </form>
      <br/>
    </>
  )
}

export default AnecdoteFrom