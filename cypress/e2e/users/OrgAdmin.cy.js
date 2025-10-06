import user_methods from "../../Page-Objects/users.cy";

describe('Org Admin - Users Page Tests', () => {
    beforeEach(() => {
        cy.login(Cypress.env('fnEmail'), Cypress.env('fnPassword'));
        user_methods.init();
        user_methods.navigateToUsersPage();

    });

    // Creation User Flows
    it('Should Add a new User', () => {
        user_methods.inviteOneUser();
    });

    it('should add bulk users', () => {
        user_methods.inviteBulkUsers(3);
    });
    it('should not allow inviting already invited user', () => {
        user_methods.inviteAlreadyInvitedUser();
    });

    // Edit User Flows
    it('Should Edit an existing User', () => {
        user_methods.editUser();
    });

    it('Should Deactivate and activate an existing User', () => {
        user_methods.deactivateUser();
        user_methods.activateUser();
    });

});