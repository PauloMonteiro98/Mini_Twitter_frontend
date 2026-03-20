describe("Fluxo Principal do Mini Twitter", () => {
  const emailUnico = `Fuxico.${Date.now()}@exemplo.com`;
  const senhaPadrao = "123456";
  const nomeUsuario = "Fulano de Tal";

  it("deve cadastrar um novo usuário, fazer login, criar um post, editá-lo e excluí-lo", () => {
    
    // --- CADASTRO ---
    cy.visit("/register");

    cy.get('input[placeholder="Insira o seu nome"]').type(nomeUsuario);
    cy.get('input[placeholder="Insira o seu e-mail"]').type(emailUnico);
    cy.get('input[placeholder="Insira a sua senha"]').type(senhaPadrao);

    cy.contains("button", "Continuar").click();

    // --- LOGIN ---
    cy.url().should("include", "/login");

    cy.get('input[placeholder="Insira o seu e-mail"]').type(emailUnico);
    cy.get('input[placeholder="Insira a sua senha"]').type(senhaPadrao);
    cy.contains("button", "Continuar").click();

    // --- TIMELINE E CRIAÇÃO DO POST ---
    cy.url().should("eq", Cypress.config().baseUrl + "/timeline");
    cy.contains("Mini Twitter").should("be.visible");

    // Clica no botão para abrir o modal
    cy.contains("E aí, o que está rolando?").click();

    // Escreve um novo post dentro do modal
    const tituloDoPost = `A data de hoje é ${new Date().toLocaleDateString()}`;
    const textoDoPost = `Post gerado pelo Cypress às ${new Date().toLocaleTimeString()}`;

    cy.get('input[placeholder="Título"]')
      .should("be.visible")
      .type(tituloDoPost);

    cy.get('textarea[placeholder="E aí, o que está rolando?"]')
      .should("be.visible")
      .type(textoDoPost);

    cy.contains("button", "Postar").click();

    // --- VERIFICAÇÃO DE CRIAÇÃO ---
    cy.contains(textoDoPost).should("be.visible");
    cy.contains(nomeUsuario).should("be.visible");

    // --- EDIÇÃO DO POST ---
    const textoEditado = `${textoDoPost} - [ATUALIZADO]`;

    cy.get('button[title="Editar"]').first().click();
    cy.get('textarea[placeholder="Editando..."]').clear().type(textoEditado);

    cy.contains("button", "Salvar").click();

    // --- EXCLUSÃO DO POST ---
    cy.get('button[title="Excluir"]').first().click();
    cy.get('button[title="Confirmar exclusão"]').should("be.visible").click();

    cy.contains(textoEditado).should("not.exist");
  });
});
