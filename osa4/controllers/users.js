const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, url: 1, likes: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || !username) {
    response.status(400).json({ error: 'Username and password are required, minlength 3' })

  } else if (await User.exists({ username: username })) {
    response.status(400).json({ error: 'Username must be unique' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    try {
      const savedUser = await user.save()
      response.status(201).json(savedUser)
    } catch (error) {
      response.status(400).end(error.message)
    }
  }
})

module.exports = usersRouter