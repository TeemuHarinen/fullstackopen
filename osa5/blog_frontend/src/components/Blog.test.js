import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

// BLOG TESTS
describe('blog tests', () => {
  let container
  beforeEach(() => {
    const blog = {
      title: 'Blog test',
      author: 'John test',
      url: 'http://example.com',
      likes: 1234,
      user: {
        username: 'John Doe'
      }
    }
    const exampleUser = {
      username: 'John Doe',
      name: 'John'
    }
    container = render(<Blog blog={blog} user={exampleUser} toggle/>).container
  })

  test('renders blog title', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('Blog test')
  })

  test('clicking button reveals url and likes', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.viewButton')
    await user.click(button)
    const div = container.querySelector('.fullBlog')
    expect(div).toHaveTextContent('http://example.com')
    expect(div).toHaveTextContent('1234')
    // expect(div).toHaveTextContent('John') is rendered in app, only used comparing blog user to logged in user
  })
})

// TOGGLABLE TESTS
describe('<Togglable />', () => {
  let container
  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>
      </Togglable>
    ).container
  })

  test('after clicking blog, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })
})

describe('Individual tests', () => {
  test('like button event handler works as expected', async () => {
    const mockHandler = jest.fn()
    const blog = {
      title: 'Blog test',
      author: 'John test',
      url: 'http://example.com',
      likes: 1234,
      user: {
        username: 'John Doe'
      }
    }
    const exampleUser = {
      username: 'John Doe',
      name: 'John'
    }
    const container = render(<Blog blog={blog} user={exampleUser} updateLike={mockHandler} toggle/>).container

    const user = userEvent.setup()
    const button = container.querySelector('.viewButton')
    await user.click(button)
    const likeButton = container.querySelector('.likeButton')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('<BlogFrom> uses createBlog correctly', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const title = container.querySelector('#title-input')
    const author = container.querySelector('#author-input')
    const url = container.querySelector('#url-input')
    const sendButton = screen.getByText('create')

    await user.type(title, 'test title')
    await user.type(author, 'test author')
    await user.type(url, 'test url')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('test title')
    expect(createBlog.mock.calls[0][0].author).toBe('test author')
    expect(createBlog.mock.calls[0][0].url).toBe('test url')
  })
})