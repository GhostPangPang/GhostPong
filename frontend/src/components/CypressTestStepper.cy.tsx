import React from 'react';
import Stepper from './CypressTest';

describe('<Stepper />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Stepper />);
  });
  it('stepper should default to 0', () => {
    cy.mount(<Stepper />);
    cy.get('span').should('have.text', '0');
  });
});
