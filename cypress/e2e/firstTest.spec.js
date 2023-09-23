/// <reference types="cypress" />


describe('Tests with backend', ()=>{

    beforeEach('login to the app', ()=>{
        // intercept get call and use tags.json as a body of the response
        cy.intercept('GET', 'https://api.realworld.io/api/tags', {fixture:'tags.json'})
        cy.loginToApp()
    })

    it('test to login', () => {
        cy.log('you re logged in')        
    })

    it('create an article with intercept and verify response', () => {
        // intercept should be before the action you want to verify
        // intecept the call and assert the request and response of your test
        cy.intercept('POST', 'https://api.realworld.io/api/articles/').as('postArticle')

        cy.get('a[routerlink="/editor"]').click()
        cy.get('[formcontrolname="title"]').type('This is Annas article')
        cy.get('[formcontrolname="description"]').type('it\'s about something')
        cy.get('[formcontrolname="body"]').type('article body')
        cy.contains(' Publish Article ').click()

        cy.wait('@postArticle').then(xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.be.equal(201)
            expect(xhr.request.body.article.body).to.be.equal('article body')
            expect(xhr.response.body.article.description).to.equal('it\'s about something')   
        })
    })

    it('verify tags in the list with mock', ()  => {
        cy.log('we logged in')
        cy.get('.tag-list').should('contain', 'cypress')
        .and('contain', 'automation')
        .and('contain', 'superlongtagtoseeifitbreakstheui')
    })

    it.only('change data in response and verify the likes change upon click', () => {
        cy.intercept('GET', 'https://api.realworld.io/api/articles*', {fixture:'globalFeedArticles.json'})
        cy.log('check articles shown')

        cy.contains('Global Feed').click
        cy.get('app-article-list button').then(hearts => {
            expect(hearts[0]).to.contain('5')
            expect(hearts[1]).to.contain('1')
    })
    // read fixture file
        cy.fixture('globalFeedArticles').then(file => {
            const articleLink = file.articles[0].slug
            file.articles[0].favouritesCount = 6
            cy.intercept('POST', 'https://api.realworld.io/api/articles/'+articleLink+'/favorite', file)
        })
        cy.get('app-article-list button').eq(0).click().should('contain', '6')
})
})

