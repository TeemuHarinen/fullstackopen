import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    addVote(state, action) {
      return state.map(a => a.id !== action.payload ? a : {...a, votes: a.votes+1}).sort((a, b) => b.votes - a.votes)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const increaseVote = (anecdoteToModify) => {
  return async dispatch => {
    const updatedAnecdote = { ...anecdoteToModify, votes: anecdoteToModify.votes+1}
    await anecdoteService.update(anecdoteToModify.id, updatedAnecdote)
    dispatch(addVote(anecdoteToModify.id))
  }
}
export const { appendAnecdote,
               addVote,
               setAnecdotes
            } = anecdoteSlice.actions
export default anecdoteSlice.reducer



