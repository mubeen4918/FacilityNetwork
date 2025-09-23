class facility_methods {

    invalid_email() {
        cy.visit(Cypress.env('loginUrl'))
        cy.get('input[formcontrolname="email"]', { timeout: 10000 }).type('fnEmail');
        cy.get('input[formcontrolname="password"]', { timeout: 10000 }).type('fnPassword');
        cy.get('button[type="submit"]').should('be.visible').click();
        cy.get('span').contains('Enter a valid email');
    }
    invalid_password() {
        cy.visit(Cypress.env('loginUrl'))
        cy.get('input[formcontrolname="email"]', { timeout: 10000 }).type(Cypress.env('fnEmail'));
        cy.get('input[formcontrolname="password"]', { timeout: 10000 }).type('fnPassword');
        cy.get('button[type="submit"]').should('be.visible').click();
        cy.get('#swal2-html-container').should('have.text', 'Invalid email or password.');
    }
    valid_login() {
        cy.visit(Cypress.env('loginUrl'))
        cy.get('input[formcontrolname="email"]', { timeout: 10000 }).type(Cypress.env('fnEmail'));
        cy.get('input[formcontrolname="password"]', { timeout: 10000 }).type(Cypress.env('fnPassword'));
        cy.get('button[type="submit"]').should('be.visible').click();
        // cy.contains('span', 'Login').click();
        // cy.wait(5000)
        // cy.url({ timeout: 100000 }).should('include', '/main/dashboard');
        // Add any additional assertions or actions needed after a successful login
    }
} export default new facility_methods;