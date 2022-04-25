/// <reference types="cypress" />

import '../support/commands';
import { DEFAULT_URL } from './home.spec';

const pictureUrl =
	'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

describe('Login test', () => {
	const email = Cypress.env('ADMIN_EMAIL');
	const password = Cypress.env('ADMIN_PASSWORD');

	beforeEach(() => {
		cy.visit(DEFAULT_URL);
		cy.login(email, password);
	});

	it('Admin can create offer', () => {
		cy.contains('.nav-links', 'Offers').click();
		cy.contains('Create Offer').click();

		cy.get('input[placeholder="Image URL"]').type(pictureUrl);
		cy.get('input[placeholder="Discount"]').type('100');
		cy.get('input[placeholder="Description"]').type('DESCRIPTION_1');
		cy.contains('.navabr-signup-btn', 'Create').click();

		cy.contains('DESCRIPTION_1').should('be.visible');
		cy.contains('DESCRIPTION_1')
			.parent()
			.within(() => {
				cy.get('.text-danger').click({ scrollBehavior: false });
			});
		cy.contains('.navabr-signup-btn', 'Delete').click();
	});
});
