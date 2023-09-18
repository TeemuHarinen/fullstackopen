const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const api = supertest(app)


describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blog title is correct', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)
    expect(contents).toContain('First class tests')
  })

  test('blogs are identified with correct id', async () => {
    const response = await api.get('/api/blogs')

    for (var i = 0; i < helper.initialBlogs.length; i++) {
      expect(response.body[i].id).toBeDefined()
    }
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 999
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const contents = response.body.map(r => r.title)

      expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
      expect(contents).toContain('Test Title')
    })

    test('blog likes set to 0 if not defined', async () => {

      const newBlog = {
        title: 'Test Likes',
        author: 'Test Author',
        url: 'http://testurl.com'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const response = await api.get('/api/blogs')
      const contentLikes = response.body[helper.initialBlogs.length].likes
      expect(contentLikes).toBe(0)
    })

    test('blog with missing critical fields returns 400 Bad Request', async () => {
      const newBlog = {
        author: 'Test Author',
        url: 'http://testurl.com'
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })


  })

  describe('deletion of blog', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
    })

    test('succeeds with status code 204 if id is valid', async () => {
      const response = await api.get('/api/blogs')
      const noteToDelete = response.body[0]
      await api
        .delete(`/api/blogs/${noteToDelete.id}`)
        .expect(204)

      const responseAfter = await api.get('/api/blogs/')
      const notesAtEnd = responseAfter.body
      expect(notesAtEnd).toHaveLength(helper.initialBlogs.length-1)
      const contents = notesAtEnd.map(r => r.title)
      expect(contents).not.toContain(noteToDelete.content)
    })
  })

  describe('updating blog information', () => {
    test('succeeds with status code 201 when update is successful', async () => {
      const response = await api.get('/api/blogs')
      const noteToModify = response.body[0]

      const newData = { ...noteToModify, title: 'Success', likes: 555 }
      console.log(newData)
      await api
        .put(`/api/blogs/${noteToModify.id}`)
        .send(newData)
        .expect(201)

      const responseAfter = await api.get('/api/blogs')
      const contents = responseAfter.body.map(r => r.title)
      expect(contents).toContain('Success')
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})