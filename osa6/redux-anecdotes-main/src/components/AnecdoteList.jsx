import { useSelector, useDispatch } from 'react-redux'
import { increaseVote } from '../reducers/anecdoteReducer'
import { voteNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const filter = useSelector(state => state.filter)
  const anecdotes = useSelector(state => {
    if (filter) {
      return state.anecdotes.filter(anecdote => 
        anecdote.content.toLowerCase().includes(filter.toLowerCase()))
      }
      return state.anecdotes
    })

  const handleVote = (anecdote) => {
    dispatch(increaseVote(anecdote))
    dispatch(voteNotification(`You voted:  ${anecdote.content}`, 5))
  }

  return (
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList