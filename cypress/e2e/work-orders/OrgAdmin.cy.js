import workOrders_methods from '../../Page-Objects/organization.cy.js';

describe('Organization Admin Work Orders Tests', () => {
    
    beforeEach(() => {
        cy.login(Cypress.env('fnEmail'), Cypress.env('fnPassword'));
        workOrders_methods.init();
        workOrders_methods.navigateToWorkOrders();
    });

// ==========================
//  UI VALIDATION TESTS
// ==========================

    it('Should validate UI elements on Work Orders page', () => {
        workOrders_methods.validateUIElements();
    });

    it('Should validate filter dependencies', () => {
        workOrders_methods.selectFilter();
        workOrders_methods.getFilterDropdown('Trade/Service').should('have.class', 'ng-select-disabled');
        workOrders_methods.getFilterDropdown('SLA/Priority').should('have.class', 'ng-select-disabled');
        workOrders_methods.getFilterDropdown('Region').should('have.class', 'ng-select-disabled');
        
        workOrders_methods.selectFilter('Sub-Client');
        workOrders_methods.getFilterDropdown('Trade/Service').should('not.have.class', 'ng-select-disabled');
        workOrders_methods.getFilterDropdown('SLA/Priority').should('not.have.class', 'ng-select-disabled');
        workOrders_methods.getFilterDropdown('Region').should('not.have.class', 'ng-select-disabled');
    });

    it('Should validate search functionality', () => {
        workOrders_methods.validateSearchFunctionality('Test');
    });

     


// ==========================
//  END-TO-END HAPPY FLOWS
// ==========================

    it('Should create a new Work Order successfully', () => {
        workOrders_methods.createNewWorkOrder();
    });

    it('Should allow creating a Work Order with file upload', () => {
        workOrders_methods.validateFileUpload();
    });
    it('Should validate export option is available', () => {
        workOrders_methods.validateExportOption();
    });

    // it('Should easily download Work Orders report', () => {
    //     workOrders_methods.validateDownloadOption();
    // });



// ==========================
//  NEGATIVE TEST CASES
// ==========================

    it('Should not allow creating a Work Order with empty required fields', () => {
        workOrders_methods.getCreateWorkOrderButton().click();
        cy.get('h2').should('contain.text', 'Create Work Order');
        workOrders_methods.getCreateWOButton().click();
        cy.contains('Sub-Client is required').should('be.visible');
        cy.contains('This field is required').should('be.visible');
    });

    it('Should clear dependent dropdowns when Sub-Client changes', () => {
        workOrders_methods.validateDropdowns();
    });

    // Future Tests
    // it('Should show validation for invalid phone number', () => {
    //     workOrders_methods.getCreateWorkOrderButton().click();
    //     cy.get('h2').should('contain.text', 'Create Work Order');
    //     workOrders_methods.selectFromDropdown(workOrders_methods.getSubClientDropdown());
    //     cy.waitForNetworkSuccess('@getSubClientLocations');
    //     workOrders_methods.selectFromDropdown(workOrders_methods.getLocationDropdown());
    //     workOrders_methods.selectFromDropdown(workOrders_methods.getSelectPriorityDropdown());
    //     workOrders_methods.selectFromDropdown(workOrders_methods.getServiceDropdown());
    //     workOrders_methods.getSiteContactNo().type('1234'); // Invalid phone number
    //     workOrders_methods.getCreateWOButton().click();
    //     cy.contains('Enter valid phone number').should('be.visible');
    // });
    });
