// Page Object for Work Orders

import {
    generateNumericValue,
    generateUSPhoneNumber,
    generateRandomCompanyName,
    getMessageNotification,
    closeMessageNotification,
    selectFromDropdown,
    generateRandomEmail
} from '../support/utilities/utils';

class user_methods{ 

    init(){
        cy.intercept('POST', '/api/Lookup/users').as('getUsers');
        cy.intercept('POST', '/api/User/List').as('getUsersList');
        cy.intercept('GET', '/api/User/Retrieve/**').as('getUserDetails');
        cy.intercept('POST', '/api/User/Update').as('updateUserDetails');
        cy.intercept('POST', 'api/User/BulkStatusUpdate').as('bulkUserStatusUpdate');
        cy.intercept('POST', '/api/Lookup/Organizations').as('getOrganizations');
        cy.intercept('POST', '/api/User/BulkUserInvite').as('inviteUser');
    }

    navigateToUsersPage(){
        cy.get('a[href="/main/users-list"]').click({ force: true });
        cy.url().should('include', '/main/users-list');
        cy.waitForNetworkSuccess('@getUsers');
    }

    
// ==========================
//  SELECTORS (UI Elements)
// ==========================




    getInviteUserButton(){
        return cy.get('button').contains(/Invite User/i);
    }
    getUserEmailField(){
        return cy.get("[formcontrolname='email']");
    }
    getUserRoleDropdown(){
        return cy.get("[formcontrolname='role']");
    }


    getSendInviteButton(){
        return cy.get('button').contains(/Send Invite/i);
    }
    getAddButton(){
        return cy.get('button').contains(/^Add$/i);
    }

    getFirstNameField(){
        return cy.get("[formcontrolname='firstName']");
    }

    getLastNameField(){
        return cy.get("[formcontrolname='lastName']");
    }
    getPhoneField(){
        return cy.get("[formcontrolname='phoneNo']");
    }

    getUsersTab(tab='Active'){
        return cy.get('span.tab').contains(tab);
    }
    getMoreOptionsButton() {
        return cy.get('div > i').first().scrollIntoView();
    }

    getOption(option) {
        return cy.get('.row-options').contains(option);
    }

    getSaveButton(){
        return cy.get('button').contains(/Save/i);
    }
    getEditRoleDropdown(){
        return cy.get("[formcontrolname='userRoles']");
    }

    inviteOneUser(){
        this.getInviteUserButton().click();
        cy.waitForNetworkSuccess('@getOrganizations');
        const email = generateRandomEmail();
        this.getUserEmailField().type(email);
        selectFromDropdown(this.getUserRoleDropdown());
        this.getAddButton().click();
        this.getSendInviteButton().click();
        cy.waitForNetworkSuccess('@inviteUser');
        getMessageNotification('invited successfully');
        closeMessageNotification('OK');
        return email;
    }

    inviteBulkUsers(max=5){
        this.getInviteUserButton().click();
        cy.waitForNetworkSuccess('@getOrganizations');
        const emails = [];
        for(let i=0; i<max; i++){
            emails.push(generateRandomEmail());
            this.getUserEmailField().type(emails[i]);
            selectFromDropdown(this.getUserRoleDropdown());
            this.getAddButton().click();
        }
        this.getSendInviteButton().click();
        cy.waitForNetworkSuccess('@inviteUser');
        getMessageNotification('invited successfully');
        closeMessageNotification('OK');
        return emails;
    }


    inviteAlreadyInvitedUser(){
        this.getInviteUserButton().click();
        cy.waitForNetworkSuccess('@getOrganizations');
        this.getUserEmailField().type(Cypress.env('fnEmail'));
        selectFromDropdown(this.getUserRoleDropdown());
        this.getAddButton().click();
        this.getSendInviteButton().click();
        cy.waitForNetworkSuccess('@inviteUser');
        getMessageNotification('already active');
        closeMessageNotification('OK');
    }

    selectUserToEdit(tab='Active'){
        this.getUsersTab(tab).click();
        cy.waitForNetworkSuccess('@getUsersList');
        cy.wait(500); // Wait for the list to render
        this.getMoreOptionsButton().click();
    }


    editUser(){
        this.selectUserToEdit();
        this.getOption('Edit Details').click();      

        cy.waitForNetworkSuccess('@getUserDetails');
        this.getFirstNameField().invoke('val').then((firstName) => {
            const newFirstName = firstName.replace('Edited', '').trim() + ' Edited';
            this.getFirstNameField().clear().type(newFirstName);
        });
        this.getLastNameField().invoke('val').then((lastName) => {
            const newLastName = lastName.replace('Edited',' ') + ' Edited';
            this.getLastNameField().clear().type(newLastName);
        });
        const newPhone = generateUSPhoneNumber();
        this.getPhoneField().clear().type(newPhone);
        selectFromDropdown(this.getEditRoleDropdown());
        this.getSaveButton().click();
        cy.waitForNetworkSuccess('@updateUserDetails');
        getMessageNotification('successfully');
        closeMessageNotification('OK');
    }
    deactivateUser(){
        this.selectUserToEdit();
        this.getOption('Inactivate User').click();
        cy.waitForNetworkSuccess('@bulkUserStatusUpdate');
        getMessageNotification(' successfully');
        closeMessageNotification('OK');
    }
    activateUser(){
        this.selectUserToEdit('Inactive');
        this.getOption('Activate User').click();
        cy.waitForNetworkSuccess('@bulkUserStatusUpdate');
        getMessageNotification(' successfully');
        closeMessageNotification('OK');
    }

    
} export default new user_methods();