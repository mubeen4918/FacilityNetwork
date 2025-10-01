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
        cy.intercept('POST', '/api/Lookup/Organizations').as('getOrgsanizations');
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


    inviteOneUser(){
        this.getInviteUserButton().click();
        cy.waitForNetworkSuccess('@getOrgsanizations');
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
        cy.waitForNetworkSuccess('@getOrgsanizations');
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
    
} export default new user_methods();