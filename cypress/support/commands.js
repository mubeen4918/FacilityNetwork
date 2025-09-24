// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import facility_methods from '../Page-Objects/login.cy.js';


Cypress.Commands.add('login', (email, password) => {
    cy.session([email, password], () => {
        facility_methods.valid_login(email, password);
    });
    // Only visit after session is restored
    cy.then(() => {
        cy.visit('/');
    });
});

// Cypress.Commands.add('login', (email, password) => {
//   // Intercept login request to capture token
//   cy.intercept('POST', '/api/v1/accounts/login/').as('loginRequest');

//   cy.session([email, password], () => {
//     const loginPage = new LoginPage();

//     loginPage.visit();
//     loginPage.login(email, password); // Should trigger the POST

//     cy.wait('@loginRequest').then(({ response }) => {
//       const token = response.body.data.access_token;
//       cy.log('Access Token:', token);
//       cy.task('storeAuthToken', token); // Store token in global variable
//     });

//     // Ensure login succeeded
//     cy.url().should('include', '/dashboard');
//   });

//   // Always navigate to dashboard after restoring session
//   cy.visit('/dashboard');
// });