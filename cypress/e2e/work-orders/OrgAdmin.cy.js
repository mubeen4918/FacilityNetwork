import workOrders_methods from '../../Page-Objects/organization.cy.js';


describe('Organization Admin Work Orders Tests', () => {
    beforeEach(() => {
        cy.login(Cypress.env('fnEmail'), Cypress.env('fnPassword'));
        // cy.wait(5000); // Wait for 5 seconds to ensure the dashboard is fully loaded
        workOrders_methods.init();
        workOrders_methods.navigateToWorkOrders();
    });

//  UI Validation Test Cases for Work Orders Page

    it('Navigate to Work Orders and validate UI elements', () => {
        workOrders_methods.validateUIElements();
    });

    it('Filter Validation on Work Orders', () => {
        workOrders_methods.selectFilter();
        workOrders_methods.getFilterDropdown('Trade/Service').should('have.class', 'ng-select-disabled');
        workOrders_methods.getFilterDropdown('SLA/Priority').should('have.class', 'ng-select-disabled');
        workOrders_methods.getFilterDropdown('Region').should('have.class', 'ng-select-disabled');
        workOrders_methods.selectFilter('Sub-Client');
        workOrders_methods.getFilterDropdown('Trade/Service').should('not.have.class', 'ng-select-disabled');
        workOrders_methods.getFilterDropdown('SLA/Priority').should('not.have.class', 'ng-select-disabled');
        workOrders_methods.getFilterDropdown('Region').should('not.have.class', 'ng-select-disabled');
    });

    it('Validate Search Functionality on Work Orders', () => {
        workOrders_methods.validateSearchFunctionality('Test');
    });
//  End of UI Validation Test Cases for Work Orders Page

//  End to End Test Cases for Work Orders Page

    // it('Create a new Work Order', () => {
    //     workOrders_methods.createNewWorkOrder();
    //     // Add more steps to fill out the work order form and submit
    // });
    // Add more tests as needed
});