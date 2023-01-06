/// <reference types="cypress" />

import React from "react";
import OnboardingModal from "../../src/components/OnboardingModal";

describe("<OnboardingModal />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <OnboardingModal
        title={"Cypress Testing"}
        onClick={""}
        textOne={"This is a test on the onboarding modal"}
        textTwo={"It looks like it is working"}
        image={"/public/how-to-sb.png"}
        alt={":-)"}
      />
    );
  });
});
