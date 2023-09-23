/// <reference types="cypress" />

describe('Tests with backend', ()=>{

    beforeEach('login to the app', ()=>{
        cy.loginToApp()
    })

    it('test to login', () => {
        cy.log('you re logged in')        
    })

    it.only('create an article with intercept and verify response', () => {
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
                         
        } )

    })
})
