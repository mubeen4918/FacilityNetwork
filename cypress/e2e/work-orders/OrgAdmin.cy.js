import { desc } from 'framer-motion/client';
import workOrders_methods from '../../Page-Objects/organization.cy.js';


describe('Organization Admin Work Orders Tests', () => {
    beforeEach(() => {
        cy.login(Cypress.env('fnEmail'), Cypress.env('fnPassword'));
        cy.wait(5000); // Wait for 5 seconds to ensure the dashboard is fully loaded
    });

    it('Navigate to Work Orders and validate UI elements', () => {
        workOrders_methods.navigateToWorkOrders();
        workOrders_methods.validateUIElements();
    });

    // Add more tests as needed
});