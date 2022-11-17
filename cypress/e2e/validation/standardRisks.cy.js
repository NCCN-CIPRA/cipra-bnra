let testRiskFileUrl;

describe("Standard Risk File Validation", () => {
  /*before(() => {
    cy.intercept("https://bnra.powerappsportals.com/_api/cr4de_riskfileses*").as("getRiskFiles");
    cy.intercept("POST", "https://bnra.powerappsportals.com/_api/cr4de_bnraparticipations*").as("addParticipant");

    cy.bnraLogin("test_user_admin@nccn.fgov.be", "BSebMm9p3R1dzLUxNJlF").then((token) => {
      cy.get("button").contains("en").click();
      cy.bnraGet("contacts", "$filter=contains(emailaddress1,'test_user')").then((experts) => {
        cy.bnraGet("cr4de_riskfileses", "$filter=cr4de_title eq 'Test Risk'")
          .then(([riskFile]) => {
            if (riskFile) {
              // Delete cascades
              cy.bnraGet(
                "cr4de_bnrariskcascades",
                `$filter=(_cr4de_cause_hazard_value eq ${riskFile.cr4de_riskfilesid} or _cr4de_effect_hazard_value eq ${riskFile.cr4de_riskfilesid})`
              ).then((cascades) => {
                cascades.map((c) => cy.bnraDelete("cr4de_bnrariskcascades", token, c.cr4de_bnrariskcascadeid));
              });
              // Delete participations
              cy.bnraGet(
                "cr4de_bnraparticipations",
                `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}`
              ).then((participations) => {
                participations.map((p) =>
                  cy.bnraDelete("cr4de_bnraparticipations", token, p.cr4de_bnraparticipationid)
                );
              });
              // Delete attachments
              // Delete validations
              // Delete direct analyses
              // Delete cascade analyses
              // Delete feedbacks
              // Delete risk file
              return cy.bnraDelete("cr4de_riskfileses", token, riskFile.cr4de_riskfilesid).then(() =>
                cy.bnraCreate("cr4de_riskfileses", token, {
                  cr4de_title: "Test Risk",
                  cr4de_risk_type: "Standard Risk",
                  cr4de_hazard_id: "X01",
                })
              );
            }
            return cy.bnraCreate("cr4de_riskfileses", token, {
              cr4de_title: "Test Risk",
              cr4de_risk_type: "Standard Risk",
              cr4de_hazard_id: "X01",
            });
          })
          .then(() => {
            cy.get("svg[data-testid='MenuIcon']")
              .click()
              .then(() => {
                cy.get("span").contains("Hazard Catalogue").click();
              });

            // Wait for risk files list to load
            cy.wait("@getRiskFiles");
            cy.get("@getRiskFiles").its("response.statusCode").should("eq", 200);

            // 118 risks + test risk
            cy.get(".MuiContainer-root ul.MuiList-root > li").should("have.length", 119);

            // Filter for the test risk
            cy.get("input[placeholder='Filter hazard catalogue']").type("est ris");
            cy.get(".MuiContainer-root ul.MuiList-root > li").should("have.length", 1);

            cy.get("li").contains("Test Risk").click();
            cy.url().then((url) => {
              testRiskFileUrl = url;
            });

            cy.get(".MuiContainer-root > .MuiPaper-root")
              .should("have.length", 8)
              .then((cards) => {
                // Test participants
                cy.wrap(cards[0])
                  .should("contain.text", "Add Participant")
                  .contains("Add Participant")
                  .click()
                  .then(() => {
                    cy.get("input#name").type("test_user_expert1@nccn.fgov.be");

                    return cy.get(".MuiDialog-container button").contains("Add participant").click();
                  })
                  .then(() => {
                    // Wait for previous participant to be added
                    cy.wait("@addParticipant");

                    // Add another participant
                    return cy.get("button").contains("Add Participant").click();
                  })
                  .then(() => {
                    cy.get("input#name").type("test_user_admin@nccn.fgov.be");
                    cy.get("div.MuiSelect-select").contains("Topical Expert").click();
                    cy.get("li.MuiMenuItem-root").contains("Author").click();

                    return cy.get(".MuiDialog-container button").contains("Add participant").click();
                  });
              });
          })
          .then(() => {
            cy.get("button")
              .contains("Test Admin")
              .click()
              .then(() => {
                cy.get("li").contains("Log out").click().as("logout");
              });
          });
      });
    });
  });*/

  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    return cy.bnraLogin("test_user_expert1@nccn.fgov.be", "BSebMm9p3R1dzLUxNJlF", true).then(() => {
      return cy.get("button:contains('en')").click();
    });
  });

  it("displays the risk overview", () => {
    cy.intercept("GET", "https://bnra.powerappsportals.com/_api/cr4de_bnraparticipations*").as("getParticipations");
    cy.intercept("POST", "https://bnra.powerappsportals.com/_api/cr4de_bnraparticipations*").as("addParticipant");
    cy.intercept("GET", "https://bnra.powerappsportals.com/_api/cr4de_bnravalidations*").as("getValidations");

    cy.get("svg[data-testid='MenuIcon']")
      .click()
      .then(() => {
        cy.get("span").contains("Risk Analysis").click();
      });

    // Wait for risk files list to load
    cy.wait("@getParticipations");
    cy.get("@getParticipations").its("response.statusCode").should("eq", 200);

    // 118 risks + test risk
    cy.get(".MuiContainer-root ul.MuiList-root > li").should("have.length", 1);

    cy.get("li").contains("Test Risk").click();
    cy.wait("@getValidations");
    cy.url().then((url) => {
      testRiskFileUrl = url;
    });
  });

  it("allows providing feedback on the definition", () => {
    cy.intercept("PATCH", "https://bnra.powerappsportals.com/_api/cr4de_bnravalidations*").as("updateValidation");

    cy.visit(testRiskFileUrl);

    const randomInput = (Math.random() + 1).toString(36).substring(7);

    // Test definition input
    cy.get(".MuiContainer-root > .MuiPaper-root")
      .should("have.length", 7)
      .then((cards) => {
        return cy
          .wrap(cards[0])
          .should("contain.text", "1. Definition")
          .get("[contenteditable]")
          .eq(0)
          .click()
          .clear({ force: true })
          .wait(100)
          .type(randomInput[0])
          .wait(100)
          .type(randomInput[0]);
      })
      .then(() => {
        // Wait for autosave
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        return cy.wait("@updateValidation");
      })
      .then(() => {
        cy.intercept("https://bnra.powerappsportals.com/_api/cr4de_bnravalidations*").as("getValidation");

        cy.visit("https://bnra.powerappsportals.com").then(() => cy.visit(testRiskFileUrl));

        return cy.wait("@getValidation");
      })
      .then(() => {
        // Assert that definition was saved
        return cy
          .get(".MuiContainer-root > .MuiPaper-root")
          .should("have.length", 7)
          .then((cards) => {
            return cy
              .wrap(cards[0])
              .should("contain.text", "1. Definition")
              .get("[contenteditable]")
              .should("contain.text", randomInput);
          });
      });
  });
});
