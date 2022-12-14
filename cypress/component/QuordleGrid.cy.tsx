/// <reference types="cypress" />

import React from "react";
import QuordleGrid from "../../src/components/QuordleGrid";

describe("<QuordleGrid />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <QuordleGrid
        word1={"hello"}
        guess={"hello"}
        isGuessed={true}
        won={false}
      />
    );
  });
});
