/// <reference types="cypress" />

import '../support/commands';
import { DEFAULT_URL } from './home.spec';

describe('Login test', () => {
	it('Login admin and correct navbar is visible', () => {
		cy.log(Cypress.env('ADMIN_EMAIL'));
		cy.login('', 'adminadmin');

		cy.contains('.nav-links', 'Home').should('be.visible');
		cy.contains('.nav-links', 'Trainers').should('be.visible');
		cy.contains('.nav-links', 'Offers').should('be.visible');
		cy.contains('.nav-links', 'Users').should('be.visible');
		cy.contains('.nav-links', 'Timetable').should('be.visible');
		cy.contains('.nav-links', 'Profile').should('be.visible');

		cy.contains('.nav-links', 'Login').should('not.exist');
		cy.contains('.navabr-signup-btn', 'SIGN UP').should('not.exist');
	});

	xit('Home button navigates correctly', () => {
		cy.login('admin@admin.com', 'adminadmin');

		cy.contains('.nav-links', 'Home').click();
		cy.url().should('eq', DEFAULT_URL);
	});
});
