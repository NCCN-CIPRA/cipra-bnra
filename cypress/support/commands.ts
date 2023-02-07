/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("bnraGet", (table, query = "") => {
  return cy
    .request({
      url: `https://bnra.powerappsportals.com/_api/${table}?${query}`,
    })
    .then(({ body }) => body.value);
});
Cypress.Commands.add("bnraCreate", (table, token, data) => {
  return cy.request({
    url: `https://bnra.powerappsportals.com/_api/${table}`,
    method: "POST",
    headers: {
      __RequestVerificationToken: token,
    },
    body: JSON.stringify(data),
  });
});
Cypress.Commands.add("bnraDelete", (table, token, id) => {
  return cy.request({
    url: `https://bnra.powerappsportals.com/_api/${table}(${id})`,
    method: "DELETE",
    headers: {
      __RequestVerificationToken: token,
    },
  });
});

Cypress.Commands.add("bnraLogin", (email, password, instant = false) => {
  cy.intercept("/_layout/tokenhtml*").as("token");

  cy.visit("https://bnra.powerappsportals.com/auth");

  cy.get("#outlined-email-input").type(email, { delay: instant ? 0 : 10 });
  cy.get("#outlined-password-input").type(password, { delay: instant ? 0 : 10 });

  return cy
    .get("button")
    .contains("Login")
    .click()
    .then(() => {
      return cy
        .wait("@token")
        .wait("@token")
        .then(({ response }) => {
          return response?.body.split("value")[1].split('"')[1];
        });
    });
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      bnraGet(table: string, query: string): Chainable<Response<any>>;
      bnraCreate(table: string, token: string, data: any): Chainable<Response<any>>;
      bnraDelete(table: string, token: string, id: string): Chainable<Response<any>>;
      bnraLogin(email: string, password: string, instant?: boolean): Chainable<JQuery<HTMLButtonElement>>;
      //       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

export {};
