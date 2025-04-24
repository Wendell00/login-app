describe('Auth - Login', () => {
  const username = 'wendell';
  const password = 'Valido@123';

  it('It should log in with valid credentials and redirect to the home page.', () => {
    cy.visit('/');

    cy.get('input#username').type(username);
    cy.get('input#password').type(password);

    cy.contains('button', 'Continuar').click();

    cy.get('[data-testid="main-div"]').should('be.visible');
  });
});
