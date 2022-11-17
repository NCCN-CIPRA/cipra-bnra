/// <reference types="cypress" />

const amountStandardRisks = 101;
const amountEmergingRisks = 12;
const amountActorRisks = 5;

describe("Standard Risk File Editor", () => {
  before(() => {
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
            cy.get("button")
              .contains("Test Admin")
              .click()
              .then(() => {
                cy.get("li").contains("Log out").click().as("logout");
              });
          });
      });
    });
  });

  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    return cy.bnraLogin("test_user_admin@nccn.fgov.be", "BSebMm9p3R1dzLUxNJlF", true).then(() => {
      return cy.get("button:contains('en')").click();
    });
  });

  let testRiskFileUrl;

  it("displays the hazard catalogue", () => {
    cy.intercept("https://bnra.powerappsportals.com/_api/cr4de_riskfileses*").as("getRiskFiles");
    cy.intercept("POST", "https://bnra.powerappsportals.com/_api/cr4de_bnraparticipations*").as("addParticipant");

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
  });

  it("allows changing participants", () => {
    cy.intercept("https://bnra.powerappsportals.com/_api/cr4de_riskfileses*").as("getRiskFiles");
    cy.intercept("POST", "https://bnra.powerappsportals.com/_api/cr4de_bnraparticipations*").as("addParticipant");

    cy.visit(testRiskFileUrl);

    // Wait for test risk file to load
    cy.wait("@getRiskFiles").wait("@getRiskFiles", { timeout: 10000 });

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
          })
          // FIXME: Add a participant that has already been added
          .then(() => {
            cy.wait("@addParticipant");

            return cy.get("button").contains("Add Participant").click();
          })
          .then(() => {
            cy.get("input#name").type("test_user_admin@nccn.fgov.be");
            cy.get("div.MuiSelect-select").contains("Topical Expert").click();
            cy.get("li.MuiMenuItem-root").contains("Author").click();

            return cy.get(".MuiDialog-container button").contains("Add participant").click();
          });
      });
  });

  it("allows editing of the definition", () => {
    cy.intercept("PATCH", "https://bnra.powerappsportals.com/_api/cr4de_riskfileses*").as("updateRiskFile");

    cy.visit(testRiskFileUrl);

    const randomInput = (Math.random() + 1).toString(36).substring(7);

    // Test definition input
    cy.get(".MuiContainer-root > .MuiPaper-root")
      .should("have.length", 8)
      .then((cards) => {
        return cy
          .wrap(cards[1])
          .should("contain.text", "1. Definition")
          .get("[contenteditable]")
          .eq(0)
          .clear({ force: true })
          .type(randomInput, { delay: 100 });
      })
      .then(() => {
        // Wait for autosave
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        return cy.wait("@updateRiskFile");
      })
      .then(() => {
        cy.intercept("https://bnra.powerappsportals.com/_api/cr4de_riskfileses*").as("getRiskFile");

        cy.visit("https://bnra.powerappsportals.com").then(() => cy.visit(testRiskFileUrl));

        return cy.wait("@getRiskFile");
      })
      .then(() => {
        // Assert that definition was saved
        return cy
          .get(".MuiContainer-root > .MuiPaper-root")
          .should("have.length", 8)
          .then((cards) => {
            return cy
              .wrap(cards[1])
              .should("contain.text", "1. Definition")
              .get("[contenteditable]")
              .should("contain.text", randomInput);
          });
      });
  });

  it("allows editing of historical events", () => {
    cy.visit(testRiskFileUrl);

    const randomInputTime = (Math.random() + 1).toString(36).substring(7);
    const randomInputLocation = (Math.random() + 1).toString(36).substring(7);
    const randomInputDescription = (Math.random() + 1).toString(36).substring(7);

    // Test Historical Events table
    cy.get(".MuiContainer-root > .MuiPaper-root")
      .should("have.length", 8)
      .then((cards) => {
        cy.wrap(cards[2])
          .should("contain.text", "2. Historical Events")
          .get("button[aria-label='Add new historical event']")
          .click({ force: true })
          .click({ force: true })

          .then(() => {
            cy.wrap(cards[2])
              .find("table tbody tr")
              .should("have.length", 2)
              .then((rows) => {
                // Fill in second event
                cy.wrap(rows)
                  .eq(1)
                  .find("input")
                  .should("have.length", 2)
                  .then((inputs) => {
                    cy.wrap(inputs).eq(0).type(randomInputLocation);
                    cy.wrap(inputs).eq(1).type(randomInputTime);
                  });

                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wrap(rows)
                  .eq(1)
                  .find("[contenteditable]")
                  .eq(0)
                  .click()
                  .wait(500)
                  .clear({ force: true })
                  .type(randomInputDescription, { delay: 100 });

                cy.on("window:confirm", () => true);

                // Delete first event
                cy.wrap(rows).eq(0).find("button").click();
              })
              .then(() => {
                cy.intercept("PATCH", "https://bnra.powerappsportals.com/_api/cr4de_riskfileses*").as("updateRiskFile");

                cy.get("button").contains("Save & Exit").click();

                return cy.wait("@updateRiskFile");
              })
              .then(() => {
                cy.intercept("https://bnra.powerappsportals.com/_api/cr4de_riskfileses*").as("getRiskFile");

                cy.visit(testRiskFileUrl);

                return cy.wait("@getRiskFile");
              })
              .then(() => {
                // Assert that the event information was saved
                cy.get(".MuiContainer-root > .MuiPaper-root")
                  .should("have.length", 8)
                  .then((cards) => {
                    cy.wrap(cards[2])
                      .should("contain.text", "2. Historical Events")
                      .then(() => {
                        cy.wrap(cards[2])
                          .find("table tbody tr")
                          .should("have.length", 1)
                          .then((rows) => {
                            cy.wrap(rows)
                              .eq(0)
                              .find("input")
                              .should("have.length", 2)
                              .then((inputs) => {
                                cy.wrap(inputs).eq(0).should("have.value", randomInputLocation);
                                cy.wrap(inputs).eq(1).should("have.value", randomInputTime);
                              });

                            cy.wrap(rows)
                              .eq(0)
                              .find("[contenteditable]")
                              .eq(0)
                              .should("contain.text", randomInputDescription);
                          });
                      });
                  });
              });
          });
      });
  });

  it("allows editing of the parameters", () => {
    cy.visit(testRiskFileUrl);

    // Test intensity parameters table
    cy.get(".MuiContainer-root > .MuiPaper-root")
      .should("have.length", 8)
      .then((cards) => {
        cy.wrap(cards[3])
          .should("contain.text", "3. Intensity Parameters")
          .get("button[aria-label='Add new intensity parameter']")
          .click()
          .click()
          .then(() => {
            // TODO: Check if 2 parameters are present
            // TODO: fill in first parameter
            // TODO: delete second parameter
          });
      });
  });

  it("allows editing of scenarios", () => {
    cy.visit(testRiskFileUrl);

    // Test intensity scenarios table
    cy.get(".MuiContainer-root > .MuiPaper-root")
      .should("have.length", 8)
      .then((cards) => {
        cy.wrap(cards[4]).should("contain.text", "4. Intensity Scenarios");
        // TODO: check if all parameters are visible in scenarios

        // Change scenario parameters
      });
  });

  it("allows editing of causes", () => {
    cy.intercept("GET", "https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades*").as("getCascades");
    cy.intercept("POST", "https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades*").as("createCascade");

    const randomReason1 = (Math.random() + 1).toString(36).substring(7);
    const randomReason2 = (Math.random() + 1).toString(36).substring(7);

    cy.visit(testRiskFileUrl);

    // Test causes transferlist
    cy.get(".MuiContainer-root > .MuiPaper-root")
      .should("have.length", 8)
      .then((cards) => {
        cy.wrap(cards[5]).should("contain.text", "5. Causing Hazards").should("not.contain.text", "Definition of");

        cy.wrap(cards[5]).find(".MuiList-root").should("have.length", 2);

        // Select the first item of the left list (non-causing hazard)
        cy.wrap(cards[5])
          .find(".MuiList-root")
          .eq(0)
          .find(".MuiListItemText-root")
          .should("have.length", amountStandardRisks + amountActorRisks)
          .eq(0)
          .click();

        cy.wrap(cards[5]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").should("have.length", 0);

        cy.wrap(cards[5]).should("contain.text", "Definition of");

        // Move the item to the right list
        cy.wrap(cards[5]).find("button[aria-label='move selected right']").click();

        cy.wait("@getCascades").wait("@getCascades").wait("@getCascades");

        // Move another item to the right
        cy.wrap(cards[5]).find(".MuiList-root").eq(0).find(".MuiListItemText-root").eq(1).click();

        cy.wrap(cards[5]).find("button[aria-label='move selected right']").click();

        cy.wait("@getCascades");

        cy.wrap(cards[5])
          .find(".MuiList-root")
          .eq(0)
          .find(".MuiListItemText-root")
          .should("have.length", amountStandardRisks + amountActorRisks - 2);

        // Select the first item of the right list
        cy.wrap(cards[5])
          .find(".MuiList-root")
          .eq(1)
          .find(".MuiListItemText-root")
          .should("have.length", 2)
          .eq(0)
          .click();

        cy.wrap(cards[5])
          .should("contain.text", "Reason for the causal relationship")
          .should("contain.text", "Definition of");

        // Add a reason for the first item
        cy.wrap(cards[5])
          .find("[contenteditable]")
          .should("not.contain.text")
          .eq(0)
          .click()
          .clear({ force: true })
          .type(randomReason1, { delay: 100 });

        // Select the second item of the right list
        cy.wrap(cards[5]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").eq(1).click();

        // Add a reason for the first item
        cy.wrap(cards[5])
          .find("[contenteditable]")
          .should("not.contain.text")
          .eq(0)
          .click()
          .clear({ force: true })
          .type(randomReason2, { delay: 100 });

        // Select the first item of the right list again
        cy.wrap(cards[5]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").eq(0).click();

        // Check the reason
        cy.wrap(cards[5]).find("[contenteditable]").should("contain.text", randomReason1);

        // Select the second item of the right list again
        cy.wrap(cards[5]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").eq(1).click();

        // Check the reason
        cy.wrap(cards[5]).find("[contenteditable]").should("contain.text", randomReason2);

        // Move second item to the left
        cy.wrap(cards[5]).find("button[aria-label='move selected left']").click();

        cy.wait("@getCascades");

        cy.wrap(cards[5])
          .find(".MuiList-root")
          .eq(0)
          .find(".MuiListItemText-root")
          .should("have.length", amountStandardRisks + amountActorRisks - 1);

        // Only 1 item left in left list
        cy.wrap(cards[5]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").should("have.length", 1);
      });
  });

  it("allows editing of effects", () => {
    cy.intercept("GET", "https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades*").as("getCascades");
    cy.intercept("POST", "https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades*").as("createCascade");

    const randomReason1 = (Math.random() + 1).toString(36).substring(7);
    const randomReason2 = (Math.random() + 1).toString(36).substring(7);

    cy.visit(testRiskFileUrl);

    // Test causes transferlist
    cy.get(".MuiContainer-root > .MuiPaper-root")
      .should("have.length", 8)
      .then((cards) => {
        cy.wrap(cards[6]).should("contain.text", "6. Effect Hazards").should("not.contain.text", "Definition of");

        cy.wrap(cards[6]).find(".MuiList-root").should("have.length", 2);

        // Select the first item of the left list (non-causing hazard)
        cy.wrap(cards[6])
          .find(".MuiList-root")
          .eq(0)
          .find(".MuiListItemText-root")
          .should("have.length", amountStandardRisks)
          .eq(0)
          .click();

        cy.wrap(cards[6]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").should("have.length", 0);

        cy.wrap(cards[6]).should("contain.text", "Definition of");

        // Move the item to the right list
        cy.wrap(cards[6]).find("button[aria-label='move selected right']").click();

        cy.wait("@getCascades").wait("@getCascades").wait("@getCascades");

        // Move another item to the right
        cy.wrap(cards[6]).find(".MuiList-root").eq(0).find(".MuiListItemText-root").eq(1).click();

        cy.wrap(cards[6]).find("button[aria-label='move selected right']").click();

        cy.wait("@getCascades");

        cy.wrap(cards[6])
          .find(".MuiList-root")
          .eq(0)
          .find(".MuiListItemText-root")
          .should("have.length", amountStandardRisks - 2);

        // Select the first item of the right list
        cy.wrap(cards[6])
          .find(".MuiList-root")
          .eq(1)
          .find(".MuiListItemText-root")
          .should("have.length", 2)
          .eq(0)
          .click();

        cy.wrap(cards[6])
          .should("contain.text", "Reason for the causal relationship")
          .should("contain.text", "Definition of");

        // Add a reason for the first item
        cy.wrap(cards[6])
          .find("[contenteditable]")
          .should("not.contain.text")
          .eq(0)
          .click()
          .clear({ force: true })
          .type(randomReason1, { delay: 100 });

        // Select the second item of the right list
        cy.wrap(cards[6]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").eq(1).click();

        // Add a reason for the first item
        cy.wrap(cards[6])
          .find("[contenteditable]")
          .should("not.contain.text")
          .eq(0)
          .click()
          .clear({ force: true })
          .type(randomReason2, { delay: 100 });

        // Select the first item of the right list again
        cy.wrap(cards[6]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").eq(0).click();

        // Check the reason
        cy.wrap(cards[6]).find("[contenteditable]").should("contain.text", randomReason1);

        // Select the second item of the right list again
        cy.wrap(cards[6]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").eq(1).click();

        // Check the reason
        cy.wrap(cards[6]).find("[contenteditable]").should("contain.text", randomReason2);

        // Move second item to the left
        cy.wrap(cards[6]).find("button[aria-label='move selected left']").click();

        cy.wait("@getCascades");

        cy.wrap(cards[6])
          .find(".MuiList-root")
          .eq(0)
          .find(".MuiListItemText-root")
          .should("have.length", amountStandardRisks - 1);

        // Only 1 item left in left list
        cy.wrap(cards[6]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").should("have.length", 1);
      });
  });

  it("allows editing of catalysing effects", () => {
    cy.intercept("GET", "https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades*").as("getCascades");
    cy.intercept("POST", "https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades*").as("createCascade");

    const randomReason1 = (Math.random() + 1).toString(36).substring(7);
    const randomReason2 = (Math.random() + 1).toString(36).substring(7);

    cy.visit(testRiskFileUrl);

    // Test causes transferlist
    cy.get(".MuiContainer-root > .MuiPaper-root")
      .should("have.length", 8)
      .then((cards) => {
        cy.wrap(cards[7]).should("contain.text", "7. Catalysing Effects").should("not.contain.text", "Definition of");

        cy.wrap(cards[7]).find(".MuiList-root").should("have.length", 2);

        // Select the first item of the left list (non-causing hazard)
        cy.wrap(cards[7])
          .find(".MuiList-root")
          .eq(0)
          .find(".MuiListItemText-root")
          .should("have.length", amountEmergingRisks)
          .eq(0)
          .click();

        cy.wrap(cards[7]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").should("have.length", 0);

        cy.wrap(cards[7]).should("contain.text", "Definition of");

        // Move the item to the right list
        cy.wrap(cards[7]).find("button[aria-label='move selected right']").click();

        cy.wait("@getCascades").wait("@getCascades").wait("@getCascades");

        // Move another item to the right
        cy.wrap(cards[7]).find(".MuiList-root").eq(0).find(".MuiListItemText-root").eq(1).click();

        cy.wrap(cards[7]).find("button[aria-label='move selected right']").click();

        cy.wait("@getCascades");

        cy.wrap(cards[7])
          .find(".MuiList-root")
          .eq(0)
          .find(".MuiListItemText-root")
          .should("have.length", amountEmergingRisks - 2);

        // Select the first item of the right list
        cy.wrap(cards[7])
          .find(".MuiList-root")
          .eq(1)
          .find(".MuiListItemText-root")
          .should("have.length", 2)
          .eq(0)
          .click();

        cy.wrap(cards[7])
          .should("contain.text", "Reason for the causal relationship")
          .should("contain.text", "Definition of");

        // Add a reason for the first item
        cy.wrap(cards[7])
          .find("[contenteditable]")
          .should("not.contain.text")
          .eq(0)
          .click()
          .clear({ force: true })
          .type(randomReason1, { delay: 100 });

        // Select the second item of the right list
        cy.wrap(cards[7]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").eq(1).click();

        // Add a reason for the first item
        cy.wrap(cards[7])
          .find("[contenteditable]")
          .should("not.contain.text")
          .eq(0)
          .click()
          .clear({ force: true })
          .type(randomReason2, { delay: 100 });

        // Select the first item of the right list again
        cy.wrap(cards[7]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").eq(0).click();

        // Check the reason
        cy.wrap(cards[7]).find("[contenteditable]").should("contain.text", randomReason1);

        // Select the second item of the right list again
        cy.wrap(cards[7]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").eq(1).click();

        // Check the reason
        cy.wrap(cards[7]).find("[contenteditable]").should("contain.text", randomReason2);

        // Move second item to the left
        cy.wrap(cards[7]).find("button[aria-label='move selected left']").click();

        cy.wait("@getCascades");

        cy.wrap(cards[7])
          .find(".MuiList-root")
          .eq(0)
          .find(".MuiListItemText-root")
          .should("have.length", amountEmergingRisks - 1);

        // Only 1 item left in left list
        cy.wrap(cards[7]).find(".MuiList-root").eq(1).find(".MuiListItemText-root").should("have.length", 1);
      });
  });

  it("allows adding sources", () => {});
});
