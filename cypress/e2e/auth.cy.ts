describe('Autenticação - Login', () => {
  const username = 'wendell';
  const password = 'Valido@123';

  it('deve fazer login com credenciais válidas e redirecionar para a home', () => {
    cy.visit('/auth'); // ajuste se o path for diferente

    cy.get('input#username').type(username);
    cy.get('input#password').type(password);

    cy.contains('button', 'Continuar').click();

    // aguarda o redirecionamento e valida a URL
    cy.url().should('include', '/home'); // ajuste conforme seu routes.home.home
  });
});
