/// <reference types="cypress" />

import React from "react";
import ProgressBar from "../../src/components/ProgressBar";

describe("<ProgressBar />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ProgressBar progressPercentage={"65"} />);
  });
});
