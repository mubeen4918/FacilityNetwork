// Page Object for Work Orders
import {
    generateNumericValue,
    generateUSPhoneNumber,
    generateRandomCompanyName,
    getMessageNotification,
    closeMessageNotification,
    selectFromDropdown
} from '../support/utilities/utils';

class workOrders_methods {

    // ==========================
    //  INITIALIZATION
    // ==========================
    init() {
        cy.intercept('POST', '**//api/WorkOrder/List').as('getWorkOrders');
        cy.intercept('POST', '**/api/Lookup/WorkOrderSubClients').as('getWorkOrderSubClients');
        cy.intercept('POST', '**/api/Lookup/SubClientLocations').as('getSubClientLocations');
        cy.intercept('POST', '**/api/Lookup/CustomerPriorities').as('getCustomerPriorities');
        cy.intercept('POST', '**/api/Lookup/Services').as('getServices');
        cy.intercept('POST', '**/api/WorkOrder/Add').as('createWorkOrder');
    }

    navigateToWorkOrders() {
        cy.get('a[href="/main/work-order-list"]').click({ force: true });
        cy.url().should('include', '/main/work-order-list');
        cy.waitForNetworkSuccess('@getWorkOrders');
    }

    // ==========================
    //  SELECTORS (UI Elements)
    // ==========================
    getCreateWorkOrderButton() {
        return cy.get('button').contains('Create Work Order');
    }

    getFilterDropdown(text) {
        return cy.get(`ng-select[placeholder="${text}"]`).should('be.visible');
    }

    getSearchInput() {
        return cy.get('input[placeholder="Search WO (Ref.# , WO#, Site ID, Site Address.)"]');
    }

    getSubClientDropdown() {
        return cy.get('[formcontrolname="subClient"]');
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

    getCreateWOButton() {
        return cy.get('span.indicator-label').contains('Submit WO').should('be.visible');
    }

    getClearSubClientSelection() {
        return cy.get('span.ng-clear-wrapper.ng-star-inserted').first().should('be.visible');
    }

    getMoreOptionsButton() {
        return cy.get('div > i').first().scrollIntoView();
    }

    getOption(option) {
        return cy.get('.row-options').contains(option);
    }

    // ==========================
    //  COMMON ACTIONS
    // ==========================


    validInputs() {
        selectFromDropdown(this.getSubClientDropdown());
        cy.waitForNetworkSuccess('@getSubClientLocations');
        cy.waitForNetworkSuccess('@getCustomerPriorities');
        cy.waitForNetworkSuccess('@getServices');
        selectFromDropdown(this.getLocationDropdown());
        selectFromDropdown(this.getSelectPriorityDropdown());
        selectFromDropdown(this.getServiceDropdown());
        this.getRequestReferenceInput().type('Test Reference Code');
        this.getServiceDescriptionInput().type('This is a test service description for the work order.');
        this.getNTE().type(generateNumericValue(100, 1000));
        this.getSiteContactName().type(generateRandomCompanyName());
        this.getSiteContactNo().type(generateUSPhoneNumber());
    }

    // ==========================
    //  VALIDATIONS
    // ==========================
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
        this.getFilterDropdown('Status');
        this.getFilterDropdown('Sub-Client');
        this.getFilterDropdown('Trade/Service');
        this.getFilterDropdown('SLA/Priority');
        this.getFilterDropdown('Region');
    }

    validateSearchFunctionality(searchTerm) {
        this.getSearchInput().clear().type(searchTerm);
        cy.waitForNetworkSuccess('@getWorkOrders').then(interception => {
            if (interception.response.body.data.totalCount !== 0) {
                cy.get('datatable-scroller').each($el => {
                    expect($el.text().toLowerCase()).to.contain(searchTerm.toLowerCase());
                });
            }
        });
    }

    selectFilter(filter = 'Status') {
        this.getFilterDropdown(filter).find('.ng-placeholder').click({ force: true });
        let searchTerm;
        cy.get('.ng-option').then(options => {
            const randomIndex = Math.floor(Math.random() * options.length);
            searchTerm = options[randomIndex].innerText;
            cy.wrap(options[randomIndex]).click({ force: true });
        });
        cy.waitForNetworkSuccess('@getWorkOrders').then(interception => {
            if (interception.response.body.data.totalCount !== 0) {
                cy.get('datatable-row-wrapper').each($row => {
                    cy.wrap($row).find('span').invoke('text').then(rowText => {
                        const cleanText = rowText.replace(/\u00a0/g, ' ').trim();
                        expect(cleanText.toLowerCase()).to.include(searchTerm.toLowerCase());
                    });
                });
            }
        });
    }

    validateDropdowns() {
        this.getCreateWorkOrderButton().click();
        cy.waitForNetworkSuccess('@getWorkOrderSubClients');
        cy.get('h2').should('contain.text', 'Create Work Order');
        selectFromDropdown(this.getSubClientDropdown());
        cy.waitForNetworkSuccess('@getSubClientLocations');
        selectFromDropdown(this.getLocationDropdown());
        cy.waitForNetworkSuccess('@getCustomerPriorities');
        selectFromDropdown(this.getSelectPriorityDropdown());
        cy.waitForNetworkSuccess('@getServices');
        selectFromDropdown(this.getServiceDropdown());
        this.getSubClientDropdown().scrollIntoView();
        this.getClearSubClientSelection().click();
        selectFromDropdown(this.getSubClientDropdown());
        this.getCreateWOButton().click();
        cy.contains('This field is required').should('be.visible');
    }

    // ==========================
    //  HAPPY FLOWS
    // ==========================
    createNewWorkOrder() {
        this.getCreateWorkOrderButton().click();
        cy.waitForNetworkSuccess('@getWorkOrderSubClients');
        cy.get('h2').should('contain.text', 'Create Work Order');
        this.validInputs();
        this.getCreateWOButton().click();
        cy.waitForNetworkSuccess('@createWorkOrder');
        getMessageNotification('WorkOrder created successfully');
        closeMessageNotification('OK');
    }

    validateFileUpload() {
        cy.intercept('POST', '**/api/Attachment/UploadFileWithDetails').as('uploadAttachment');
        this.getCreateWorkOrderButton().click();
        cy.waitForNetworkSuccess('@getWorkOrderSubClients');
        cy.get('h2').should('contain.text', 'Create Work Order');
        this.validInputs();

        const fileName = 'Report.pdf'; // ensure this file exists in cypress/fixtures
        cy.get('input[type="file"][accept]').selectFile(`cypress/fixtures/${fileName}`, { force: true });
        cy.waitForNetworkSuccess('@uploadAttachment');
        cy.get('span.file-preview').should('contain', fileName);

        this.getCreateWOButton().click();
        cy.waitForNetworkSuccess('@createWorkOrder');
        getMessageNotification('WorkOrder created successfully');
        closeMessageNotification('OK');
    }

    validateDownloadOption() {
        cy.intercept('GET', '**/Root/Files/**').as('getFile');
        this.getMoreOptionsButton().click({ force: true });
        this.getOption('View Details').click({ force: true });

        cy.get('img[alt="template_file.xlsx"]').scrollIntoView().should('be.visible').click({ force: true });

        const downloadsFolder = Cypress.config('downloadsFolder');
        cy.get('button').contains('Download').click();
        cy.waitForNetworkSuccess('@getFile');
        cy.readFile(`${downloadsFolder}/template_file.xlsx`).should('exist');
    }

    validateExportOption() {
        cy.intercept('GET', '**/api/WorkOrder/Retrieve/**').as('RetrieveOrder');
        this.getMoreOptionsButton().click({ force: true });
        this.getOption('Export').click({ force: true });
        cy.waitForNetworkSuccess('@RetrieveOrder');

        const downloadsFolder = Cypress.config('downloadsFolder');
        cy.get('td').contains('Save').should('be.visible').click();
        cy.get('.stiJsViewerClearAllStyles').contains(/Adobe/i).should('be.visible').click();
        cy.get('.stiJsViewerClearAllStyles').contains(/ok/i).should('be.visible').click();
        cy.readFile(`${downloadsFolder}/Report.pdf`).should('exist');
    }
}

export default new workOrders_methods();
