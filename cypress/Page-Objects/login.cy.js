import workOrders_methods from './organization.cy.js';
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
        cy.get('#swal2-html-container', { timeout: 10000 }).should('have.text', 'Invalid email or password.');
    }
    valid_login() {

        cy.intercept('POST', '**/api/Auth/Login').as('loginRequest');
        cy.intercept('POST', '**//api/Auth/VerifyOTP').as('verifyOTPRequest');
        cy.visit(Cypress.env('loginUrl'))
        cy.get('input[formcontrolname="email"]', { timeout: 10000 }).type(Cypress.env('fnEmail'));
        cy.get('input[formcontrolname="password"]', { timeout: 10000 }).type(Cypress.env('fnPassword'));
        cy.get('button[type="submit"]').should('be.visible').click();

        cy.waitForNetworkSuccess('@loginRequest');
        cy.get('p-inputotp input.custom-otp-input')
            .eq(0).type('1')
            .get('p-inputotp input.custom-otp-input').eq(1).type('2')
            .get('p-inputotp input.custom-otp-input').eq(2).type('3')
            .get('p-inputotp input.custom-otp-input').eq(3).type('4');
            cy.contains('button', 'Verify', { timeout: 10000 }).click();

        cy.waitForNetworkSuccess('@verifyOTPRequest');
        cy.task('getGmailOTP').then((otp) => {
            cy.log(`OTP is: ${otp}`);

            // Ensure OTP is treated as a string
            const otpDigits = otp.toString().split('');

            cy.get('p-inputotp input.custom-otp-input').each(($el, index) => {
                cy.wrap($el)
                .clear()
                .type(otpDigits[index]);
            });
        });

        cy.contains('button', 'Verify', { timeout: 10000 }).click();
        
        cy.url({ timeout: 10000 }).should('include', '/main');

    }
} export default new facility_methods;