// This is a placeholder for workOrders related methods
import {
    generateNumericValue,
    generateUSPhoneNumber,
    generateRandomCompanyName,
    getMessageNotification
} from '../support/utilities/utils';

class workOrders_methods {

   init() {
// Intercept the work orders API call
        cy.intercept('POST', '**//api/WorkOrder/List').as('getWorkOrders');
        cy.intercept('POST', '**/api/Lookup/WorkOrderSubClients').as('getWorkOrderSubClients');
        cy.intercept('POST', '**/api/Lookup/SubClientLocations').as('getSubClientLocations');
        cy.intercept('POST', '**/api/Lookup/CustomerPriorities').as('getCustomerPriorities');
        cy.intercept('POST', '**/api/Lookup/Services').as('getServices');
        cy.intercept('POST', '**/api/WorkOrder/Add').as('createWorkOrder');
    }

    navigateToWorkOrders() {
        cy.get('a[href="/main/work-order-list"]').click({force: true});
        cy.url().should('include', '/main/work-order-list');
        cy.waitForNetworkSuccess('@getWorkOrders');
    }
// WorkOrder UI elements

    getCreateWorkOrderButton() {
        return cy.get('button').contains('Create Work Order');
    }

    getFilterDropdown(text) {
        return cy.get(`ng-select[placeholder="${text}"]`).should('be.visible');
    }

    getSearchInput(){
         return cy.get('input[placeholder="Search WO (Ref.# , WO#, Site ID, Site Address.)"]');
    }

    validateSearchFunctionality(searchTerm) {
        this.getSearchInput().clear().type(searchTerm);
        cy.waitForNetworkSuccess('@getWorkOrders').then((interception) => {
            // Check the response of the request
            if( interception.response.body.data.totalCount !== 0 ) {
                cy.get('datatable-scroller').each($el => {
                    expect($el.text().toLowerCase()).to.contain(searchTerm.toLowerCase());
                });
            }
        });
    }


    selectFilter(filter='Status') {
        this.getFilterDropdown(filter).find('.ng-placeholder').click({force:true});
        let selectedText;
        cy.get('.ng-option').then(options => {
            const randomIndex = Math.floor(Math.random() * options.length);
            selectedText = options[randomIndex].innerText;
            cy.wrap(options[randomIndex]).click({ force: true });
        });
        cy.waitForNetworkSuccess('@getWorkOrders').then((interception) => {
            // Check the response of the request
            if( interception.response.body.data.totalCount !== 0 ) {
                cy.get('datatable-body-cell').each($el => {
                    expect($el.text()).to.contain(selectedText);
                });
            }
        });
    }
    
    
//  UI Validation for Work Orders Page
    validateUIElements() {
        this.getCreateWorkOrderButton().should('be.visible');
        cy.contains('Trade/Service').should('be.visible');
        cy.contains('SLA/Priority').should('be.visible');
        cy.contains('Region').should('be.visible');
        cy.contains('Status').should('be.visible');
        cy.contains('WO #').should('be.visible');
        cy.contains('Ref. Code').should('be.visible');
        cy.contains('Site Code').should('be.visible');
        cy.contains('Site Address').should('be.visible');
        this.getFilterDropdown('Status').should('be.visible');
        this.getFilterDropdown('Sub-Client').should('be.visible');
        this.getFilterDropdown('Trade/Service').should('be.visible');
        this.getFilterDropdown('SLA/Priority').should('be.visible');
        this.getFilterDropdown('Region').should('be.visible');
    }
// Selectors and methods for creating a new work order

    getSubClientDropdown() {
        return cy.get('[formcontrolname="subClient"]').should('be.visible');
    }

    getLocationDropdown() {
        return cy.get('[formcontrolname="locationId"]').should('be.visible');
    }

    getSelectPriorityDropdown() {
        return cy.get('[formcontrolname="priorityId"]').should('be.visible');
    }
    getServiceDropdown() {
        return cy.get('[formcontrolname="serviceId"]').should('be.visible');
    }

    getRequestReferenceInput() {
        return cy.get('[formcontrolname="requestRefCode"]').should('be.visible');
    }
    getServiceDescriptionInput() {
        return cy.get('[formcontrolname="serviceDescription"]').should('be.visible');
    }
    getNTE() {
        return cy.get('[formcontrolname="nte"]').should('be.visible');
    }
    getSiteContactName() {
        return cy.get('[formcontrolname="siteContactName"]').should('be.visible');
    }
    getSiteContactNo() {
        return cy.get('[formcontrolname="siteContactNo"]').should('be.visible');
    }

    getCreateWOButton(){
        return cy.get('span.indicator-label').contains('Submit WO').should('be.visible');
    }

    selectFromDropdown(dropdownElement) {
        cy.wait(1000); 
        dropdownElement.click(); 
        cy.get('.ng-option')
        .then(options => {
            const randomIndex = Math.floor(Math.random() * options.length);
            cy.wrap(options[randomIndex]).click({ force: true });
        });
    }


    closeMessageNotification(button) {
        cy.get('div.swal2-actions > button.swal2-confirm.swal2-styled').contains(button).click();
    }

//  Happy Flow for creating a new work order
   createNewWorkOrder() {
        this.getCreateWorkOrderButton().click();
        cy.waitForNetworkSuccess('@getWorkOrderSubClients');
        cy.get('h2').should('contain.text', 'Create Work Order');
        this.selectFromDropdown(this.getSubClientDropdown());
        cy.waitForNetworkSuccess('@getSubClientLocations');
        cy.waitForNetworkSuccess('@getCustomerPriorities');
        cy.waitForNetworkSuccess('@getServices');
        this.selectFromDropdown(this.getLocationDropdown());
        this.selectFromDropdown(this.getSelectPriorityDropdown());
        this.selectFromDropdown(this.getServiceDropdown());
        this.getRequestReferenceInput().type('Test Reference Code');
        this.getServiceDescriptionInput().type('This is a test service description for the work order.');
        this.getNTE().type(generateNumericValue(100, 1000));
        this.getSiteContactName().type(generateRandomCompanyName());
        this.getSiteContactNo().type(generateUSPhoneNumber());
        this.getCreateWOButton().click();
        cy.waitForNetworkSuccess('@createWorkOrder');
        getMessageNotification('WorkOrder created successfully');
        this.closeMessageNotification('OK');
    }

// Invalid Flows will be added here






}
export default new workOrders_methods;