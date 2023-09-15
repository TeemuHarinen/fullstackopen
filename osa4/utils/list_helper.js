const lodash = require('lodash')

const totalLikes = (blogs) => {
  let sum = 0
  for (var i = 0; i <blogs.length; i++) {
    sum +=blogs[i].likes
  }
  return sum
}

const favouriteBlog = (blogs) => {
  let maxLikes = 0
  let favouriteBlog = []
  for (var i = 0; i <blogs.length; i++) {
    if (blogs[i].likes > maxLikes) {
      maxLikes = blogs[i].likes
      favouriteBlog[0] = blogs[i]
    }
  }
  return favouriteBlog
}

const mostBlogs = (blogs) => {
  let authors = []
  let mostAuthor = {
    author: '',
    blogs: Number
  }

  for (var i = 0; i <blogs.length; i++) {
    authors.push(blogs[i].author)
  }
  mostAuthor.author = lodash.max(authors)
  const totalBlogs = authors.filter((author) => author === mostAuthor.author).length
  mostAuthor.blogs = totalBlogs

  return mostAuthor
}

const mostLikes = (blogs) => {
  let uniqueAuthors = []
  let authorsAndLikes = []
  for (var i = 0; i <blogs.length; i++) {
    if (uniqueAuthors.includes(blogs[i].author) === false) {
      uniqueAuthors.push(blogs[i].author)
    }
  }

  for (var j = 0; j < uniqueAuthors.length; j++) {
    let currentAuthor = uniqueAuthors[j]
    var currentBlogs = blogs.filter((blog) => {if (blog.author === currentAuthor) {return blog}})
    let currentTotal = 0

    currentBlogs.forEach((blog) => {
      currentTotal += blog.likes
    })
    authorsAndLikes.push({ author: currentAuthor, likes: currentTotal })
    currentBlogs = []
  }

  let maxLikes = 0
  let maxAuthor = {}
  for (var k = 0; k < authorsAndLikes.length; k++) {
    if (authorsAndLikes[k].likes > maxLikes) {
      maxLikes = authorsAndLikes[k].likes
      maxAuthor = { author: authorsAndLikes[k].author, likes: maxLikes }
    }
  }
  return maxAuthor
}

module.exports = {
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}