import facility_methods from '../../Page-Objects/login.cy.js';

describe('Login Tests', () => {
  it('Log in with invalid email', () => {
    facility_methods.invalid_email();
  });

  it('Log in with invalid password', () => {
    facility_methods.invalid_password();
  });

  it('Should log in successfully with valid credentials', () => {
    facility_methods.valid_login();
  });
});
