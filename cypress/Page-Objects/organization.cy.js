// This is a placeholder for workOrders related methods

class workOrders_methods {
    navigateToWorkOrders() {
        cy.get('a[href="/main/work-order-list"]').click();
        cy.url().should('include', '/main/work-order-list');
    }

    validateUIElements() {
        cy.get('button').contains('Create Work Order').should('be.visible');
    }


}
export default new workOrders_methods;