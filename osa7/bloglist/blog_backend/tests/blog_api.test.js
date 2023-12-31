const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

// Tests for blogs
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
    beforeEach(async () => {
      await User.deleteMany({})
      for (var i = 0; i < helper.initialUsers.length; i++) {
        const password = helper.initialUsers[i].password
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
          username: helper.initialUsers[i].username,
          name: helper.initialUsers[i].name,
          passwordHash: passwordHash
        })
        await user.save()
      }
    })

    test('a valid blog can be added', async () => {
      const usersAtStart = await helper.usersInDb()
      const exampleUser = usersAtStart[0]
      const newBlog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 999,
        userId: exampleUser.id
      }
      const user = {
        username: usersAtStart[0].username,
        password: helper.initialUsers[0].password
      }
      // Logging in
      const request =
      await api
        .post('/api/login')
        .send(user)

      const token = request.body.token

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const contents = response.body.map(r => r.title)

      expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
      expect(contents).toContain('Test Title')
    })

    test('fails with status code 401 if token is invalid or missing', async () => {
      const usersAtStart = await helper.usersInDb()
      const exampleUser = usersAtStart[0]
      const newBlog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 999,
        userId: exampleUser.id
      }
      /*
      const user = {
        username: usersAtStart[0].username,
        password: helper.initialUsers[0].password
      }
      // Logging in
      const request =
      await api
        .post('/api/login')
        .send(user)

      const token = request.body.token
      */
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blog likes set to 0 if not defined', async () => {
      const usersAtStart = await helper.usersInDb()
      const exampleUser = usersAtStart[0]

      const newBlog = {
        title: 'Test Likes',
        author: 'Test Author',
        url: 'http://testurl.com',
        userId: exampleUser.id
      }
      const user = {
        username: usersAtStart[0].username,
        password: helper.initialUsers[0].password
      }
      // Logging in
      const request =
      await api
        .post('/api/login')
        .send(user)

      const token = request.body.token
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const response = await api.get('/api/blogs')
      const contentLikes = response.body[helper.initialBlogs.length].likes
      expect(contentLikes).toBe(0)
    })

    test('blog with missing critical fields returns 400 Bad Request', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = {
        username: usersAtStart[0].username,
        password: helper.initialUsers[0].password
      }
      // Logging in
      const request =
      await api
        .post('/api/login')
        .send(user)

      const token = request.body.token

      const newBlog = {
        author: 'Test Author',
        url: 'http://testurl.com'
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })
  })

  describe('deletion of blog', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
      await User.deleteMany({})

      for (var i = 0; i < helper.initialUsers.length; i++) {
        const user =({
          username: helper.initialUsers[i].username,
          name: helper.initialUsers[i].name,
          password: helper.initialUsers[i].password
        })
        await api
          .post('/api/users')
          .send(user)
      }

      for (var j = 0; j < helper.initialBlogs.length; j++) {
        const users = await helper.usersInDb()
        const user = {
          username: users[0].username,
          password: helper.initialUsers[0].password
        }
        // Logging in
        const response = await api
          .post('/api/login')
          .send(user)

        const token = response.body.token

        await api
          .post('/api/blogs')
          .send(helper.initialBlogs[0])
          .set('Authorization', `Bearer ${token}`)
      }
    })

    test('succeeds with status code 204 if id is valid', async () => {
      const response = await api.get('/api/blogs')
      const noteToDelete = response.body[0]

      const user = {
        username: helper.initialUsers[0].username,
        password: helper.initialUsers[0].password
      }
      // Logging in
      const request =
      await api
        .post('/api/login')
        .send(user)

      const token = request.body.token
      await api
        .delete(`/api/blogs/${noteToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
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

// Tests for user

describe('when there is already one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('test', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'teme',
      name: 'Teemu Harinen',
      password: 'examplepass'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)

  })

  test('creation fails with proper statuscode and message if username already taken',
    async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Teemu Harinen',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      expect(result.body.error).toContain('Username must be unique')
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

})

afterAll(async () => {
  await mongoose.connection.close()
})