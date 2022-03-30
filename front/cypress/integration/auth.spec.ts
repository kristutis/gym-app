/// <reference types="cypress" />

import '../support/commands';
import { DEFAULT_URL } from './home.spec';

describe('Login test', () => {
	const email = Cypress.env('ADMIN_EMAIL');
	const password = Cypress.env('ADMIN_PASSWORD');

	beforeEach(() => {
		cy.visit(DEFAULT_URL);
		cy.login(email, password);
	});

	it('Admin can login successfully and a correct navbar is visible', () => {
		cy.contains('.nav-links', 'Home').should('be.visible');
		cy.contains('.nav-links', 'Trainers').should('be.visible');
		cy.contains('.nav-links', 'Offers').should('be.visible');
		cy.contains('.nav-links', 'Users').should('be.visible');
		cy.contains('.nav-links', 'Timetable').should('be.visible');
		cy.contains('.nav-links', 'Profile').should('be.visible');

		cy.contains('.nav-links', 'Login').should('not.exist');
		cy.contains('.navabr-signup-btn', 'SIGN UP').should('not.exist');
	});

	it('Admin navbar buttons navigates correctly', () => {
		cy.contains('.nav-links', 'Offers').click();
		cy.url().should('eq', DEFAULT_URL + 'offers');

		cy.contains('.nav-links', 'Users').click();
		cy.url().should('eq', DEFAULT_URL + 'users');

		cy.contains('.nav-links', 'Timetable').click();
		cy.url().should('eq', DEFAULT_URL + 'admin-timetable');

		cy.contains('.nav-links', 'Profile').click();
		cy.url().should('eq', DEFAULT_URL + 'profile');
	});
});
