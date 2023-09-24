/// <reference types="cypress" />


describe('Tests with backend', ()=>{

    beforeEach('login to the app', ()=>{
        // intercept get call and use tags.json as a body of the response
        cy.intercept({method:'GET', path:'tags'}, {fixture:'tags.json'})
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

    it('intercept and modify request and response', () => {
        // intercept should be before the action you want to verify
        // intecept the call and assert the request and response of your test
        // cy.intercept('POST', '**/articles/', (req) => {
        //     req.body.article.description = "this is modified description"
        // }).as('postArticle')

        cy.intercept('POST', '**/articles/', (req) => {
            req.reply(res => {
                expect(res.body.article.description).to.equal('it\'s about something')
                res.body.article.description = "it\'s about something 2"
            })

        }).as('postArticle')

        cy.get('a[routerlink="/editor"]').click()
        cy.get('[formcontrolname="title"]').type('This is Annas article')
        cy.get('[formcontrolname="description"]').type('it\'s about something')
        cy.get('[formcontrolname="body"]').type('article body')
        cy.contains(' Publish Article ').click()

        cy.wait('@postArticle').then(xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.be.equal(201)
            expect(xhr.request.body.article.body).to.be.equal('article body')
            expect(xhr.response.body.article.description).to.equal('it\'s about something 2')   
        })
    })

    it('verify tags in the list with mock', ()  => {
        cy.log('we logged in')
        cy.get('.tag-list').should('contain', 'cypress')
        .and('contain', 'automation')
        .and('contain', 'superlongtagtoseeifitbreakstheui')
    })

    it('change data in response and verify the likes change upon click', () => {
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

    it.only('log in and create article via API, delete it via UI', () => {

        // use postman to verify details needed for the calls
        const userCreds = {
            "user":{
                "email":"artem.bondar16@gmail.com",
                "password":"CypressTest1"
            }
        }

        const articleDetails = {
            "article":{
                "title":"art",
                "description":"what",
                "body":"descr",
                "tagList":[]}
            }

        cy.request('POST', 'https://api.realworld.io/api/users/login', userCreds)
        .its('body').then(body => {
            const token = body.user.token
            cy.log(token)
        
            cy.request({
                url: 'https://api.realworld.io/api/articles/',
                headers: {'Authorization': 'Token '+ token},
                method: 'POST',
                body: articleDetails
            }).then(response => {
                expect(response.status).to.equal(201)
            })
            cy.contains('Global Feed').click()
            cy.get('app-article-preview').first().click()
            cy.get('.article-actions').contains('Delete Article').click()

            cy.request({
                url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token '+ token},
                method: 'GET',
                body: articleDetails
        }).its('body').then(body => {
            expect(body.articles[0].title).not.to.equal(articleDetails.article.title)
        })
    })
})
})
