describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Teemu Harinen',
      username: 'Vampu',
      password: 'supersekretpassword'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)

    const user2 = {
      name: 'Second User',
      username: 'second',
      password: 'supersekretpassword'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user2)

    cy.visit('')
  })

  it('login window can be reached', () => {
    cy.contains('Blogs')
  })

  it('login form can be opened', function() {
    cy.contains('Log in').click()
  })

  it('user can login', () => {
    cy.contains('Log in').click()
    cy.get('#username').type('Vampu')
    cy.get('#password').type('supersekretpassword')
    cy.get('#login-button').click()

    cy.contains('logged in')
  })

  it('login fails with wrong password', () => {
    cy.contains('Log in').click()
    cy.get('#username').type('Vampu')
    cy.get('#password').type('wrongpass')
    cy.get('#login-button').click()

    cy.get('.errorMessage').contains('invalid username or password')

    cy.get('html').should('not.contain', 'logged in')
  })

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'Vampu', password: 'supersekretpassword' })
      cy.contains('Add blog').click()
      cy.get('#title-input').type('test blog1')
      cy.get('#author-input').type('test author1')
      cy.get('#url-input').type('test url1')
      cy.get('#create-button').click()

      cy.contains('Add blog').click()
      cy.get('#title-input').type('test blog2')
      cy.get('#author-input').type('test author2')
      cy.get('#url-input').type('test url2')
      cy.get('#create-button').click()

      cy.contains('Add blog').click()
      cy.get('#title-input').type('test blog3')
      cy.get('#author-input').type('test author3')
      cy.get('#url-input').type('test url3')
      cy.get('#create-button').click()
    })

    it('a new blog can be created', () => {
      cy.contains('Add blog').click()
      cy.get('#title-input').type('test creation')
      cy.get('#author-input').type('test author')
      cy.get('#url-input').type('test url')
      cy.get('#create-button').click()

      cy.contains('Blog created successfully')
      cy.contains('test creation')
    })

    it('a blog can be liked', () => {
      cy.contains('test blog2 test author2')
        .contains('View')
        .click()

      cy.contains('like').click()
      cy.contains('test blog2').should('contain', 1)
    })

    it('user who created a new blog can remove it', () => {
      cy.contains('test blog3 test author3')
        .contains('View')
        .click()

      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'test blog3')
    })

    it('user who created a new blog is the only one who can remove it', () => {
      cy.login({ username: 'second', password: 'supersekretpassword' })
      cy.contains('test blog3 test author3')
        .contains('View')
        .click()

      cy.contains('test author3').should('not.contain', 'remove')
    })

    it('blogs are sorted based on likes', () => {
      // 3 likes for test blog 2
      cy.contains('test blog2 test author2')
        .contains('View')
        .click()
      cy.contains('like').click()
      cy.wait(1000) // cy.wait(time) is required because cypress doesn't refresh fast enough to update likes correctly
      cy.contains('like').click()
      cy.wait(1000)
      cy.contains('like').click()
      cy.wait(1000)
      cy.contains('Hide').click()

      // 2 likes for test blog 1
      cy.contains('test blog1 test author1')
        .contains('View')
        .click()
      cy.contains('like').click()
      cy.wait(1000)
      cy.contains('like').click()
      cy.wait(1000)
      cy.contains('Hide').click()

      // 1 like for test blog 3
      cy.contains('test blog3 test author3')
        .contains('View')
        .click()
      cy.contains('like').click()
      cy.wait(1000)
      cy.contains('Hide').click()

      // Correct order: test blog 2, test blog 1, test blog 3
      cy.get('.blog').eq(0).should('contain', 'test blog2')
      cy.get('.blog').eq(1).should('contain', 'test blog1')
      cy.get('.blog').eq(2).should('contain', 'test blog3')
    })
  })
})
