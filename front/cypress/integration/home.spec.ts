/// <reference types="cypress" />
export const DEFAULT_URL = 'http://localhost:3000/';

describe('Home page test', () => {
	beforeEach(() => {
		cy.visit(DEFAULT_URL);
	});

	it('Has all navbar buttons', () => {
		cy.contains('.nav-links', 'Home').should('be.visible');
		cy.contains('.nav-links', 'Trainers').should('be.visible');
		cy.contains('.nav-links', 'Login').should('be.visible');
		cy.contains('.navabr-signup-btn', 'SIGN UP').should('be.visible');
	});

	it('Home button navigates correctly', () => {
		cy.contains('.nav-links', 'Home').click();
		cy.url().should('eq', DEFAULT_URL);
	});

	it('Trainers button navigates correctly', () => {
		cy.contains('.nav-links', 'Trainers').click();
		cy.url().should('eq', DEFAULT_URL + 'trainers');
	});

	it('Opens login modal', () => {
		cy.contains('.nav-links', 'Login').click();
		cy.contains('Please fill out login form').should('be.visible');
		cy.get("[type='email']").should('be.visible');
		cy.get("[type='password']").should('be.visible');
	});

	it('Opens signup modal', () => {
		cy.contains('.navabr-signup-btn', 'SIGN UP').click();
		cy.contains('Please fill out sign up form').should('be.visible');
		cy.get('input[placeholder="Name"]').should('be.visible');
		cy.get('input[placeholder="Surname"]').should('be.visible');
		cy.get('input[placeholder="Email"]').should('be.visible');
		cy.get('input[placeholder="Password"]').should('be.visible');
		cy.get('input[placeholder="Repeat Password"]').should('be.visible');
	});

	it('Opens unauthorized page on protected routes', () => {
		cy.visit(DEFAULT_URL + 'users');
		cy.get('h1').should('be.visible');
		cy.get('h1').should('contain', 'Unauthorized :(');
	});
});
