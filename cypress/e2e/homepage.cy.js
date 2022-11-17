/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("Homepage", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
  });

  it("displays the hazard catalogue", () => {
    cy.intercept(
      { method: "GET", url: "/_api/cr4de_bnratranslations" },
      {
        statusCode: 200,
        body: {
          value: [
            {
              cr4de_name: "homepage.bnraLong",
              cr4de_en: "Belgian National Risk Assessment 2023 - 2026",
              cr4de_nl: "Belgische Nationale Risico Beoordeling 2023 - 2026",
            },
          ],
        },
      }
    ).as("getTranslations");

    cy.visit("http://localhost:3000/");

    cy.wait("@getTranslations");

    cy.get("button").contains("en").click();

    cy.contains("Belgian National Risk Assessment 2023 - 2026").should("exist");

    cy.get("button").contains("nl").click();

    cy.contains("Belgische Nationale Risico Beoordeling 2023 - 2026");
  });
});
