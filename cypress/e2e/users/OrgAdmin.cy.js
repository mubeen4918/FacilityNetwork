import user_methods from "../../Page-Objects/users.cy";

describe('Org Admin - Users Page Tests', () => {
    beforeEach(() => {
        cy.login(Cypress.env('fnEmail'), Cypress.env('fnPassword'));
        user_methods.init();
        user_methods.navigateToUsersPage();

    });
    it('Should Add a new User', () => {
        user_methods.inviteOneUser();
    });

    it('should add bulk users', () => {
        user_methods.inviteBulkUsers(3);
    });
    it('should not allow inviting already invited user', () => {
        user_methods.inviteAlreadyInvitedUser();
    });

});