# Phisbusters API

## Useful concepts

- controllers: This directory will contain your route handlers (also known as controllers). Each controller will handle a specific route or a group of related routes.
- services: This directory will contain your business logic. Each service will handle a specific piece of business logic.
- repositories: This directory will contain your data access logic. Each repository will handle data access for a specific model or entity.
- models: This directory will contain your data models or entities.
- routes: This directory will contain your route definitions.

## User Endpoints

POST /users/register: Register a new user (company).
POST /users/login: Login a user.
GET /users/me: Get the currently logged-in user's details.
PUT /users/me: Update the currently logged-in user's details.
DELETE /users/me: Delete the currently logged-in user's account.

## Subscription Endpoints

POST /subscriptions: Create a new subscription for the currently logged-in user.
GET /subscriptions/me: Get the currently logged-in user's subscription details.
PUT /subscriptions/me: Update the currently logged-in user's subscription.
DELETE /subscriptions/me: Cancel the currently logged-in user's subscription.

## Digital Asset Endpoints

POST /assets: Upload a new digital asset for validation.
GET /assets: Get a list of all the currently logged-in user's digital assets.
GET /assets/:id: Get a specific digital asset's details.
PUT /assets/:id: Update a specific digital asset's details.
DELETE /assets/:id: Delete a specific digital asset.

## Complaint Endpoints

GET /complaints: Get a list of all the currently logged-in user's complaints.
GET /complaints/:id: Get a specific complaint's details.
PUT /complaints/:id: Update a specific complaint's status or details.
