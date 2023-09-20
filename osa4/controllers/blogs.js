const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async(request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (body.title && body.url) {
    if (decodedToken.username !== undefined) {
      try {
        const user = await User.findById(decodedToken.id)
        const blog = new Blog({
          id: body.id,
          title: body.title,
          author: body.author,
          url: body.url,
          likes: body.likes || 0,
          user: user.id,
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)

      } catch (err) {
        response.status(400).json({ error: 'Invalid UserID' })
      }
    } else {
      response.status(400).end('username is required with token')
    }

  } else {
    response.status(400).end('Missing critical fields')
  }
}
)

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    if ( blog.user.toString() === request.user) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }
  } else {
    response.status(404).end('Invalid user or blog id')
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    id: body.id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  if (blog.title && blog.url) {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(201).json(blog)
  } else {
    response.status(400).end()
  }

})

module.exports = blogsRouter