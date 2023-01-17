/// <reference types="cypress" />



describe('Test for buttons', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('can load home page', () => {
        cy.url().should('eq', 'http://localhost:3000/')
    })

    it('Has markdown button present', () => {
        cy.get('.button[data-cy=markdown-button]')
    })
    it('Has code button present', () => {
        cy.get('.button[data-cy=code-button]')
    })
})

