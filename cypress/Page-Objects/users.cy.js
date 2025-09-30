class user_methods{ 

    init(){
        cy.intercept('POST', '/api/Lookup/users').as('getUsers');
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

    selectFromDropdown(dropdownElement) {
        cy.wait(1000);
        dropdownElement.should('be.visible').click();
        cy.get('.ng-option').then(options => {
            const randomIndex = Math.floor(Math.random() * options.length);
            cy.wrap(options[randomIndex]).click({ force: true });
        });
    }

    getSendInviteButton(){
        return cy.get('button').contains(/Send Invite/i);
    }
    getAddButton(){
        return cy.get('button').contains(/^Add$/i);
    }

    
} export default new user_methods();