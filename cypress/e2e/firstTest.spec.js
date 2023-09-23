/// <reference types="cypress" />

describe('Tests with backend', ()=>{

    beforeEach('login to the app', ()=>{
        cy.loginToApp()
    })

    it('test to login', () => {
        cy.log('you re logged in')        
    })
})
