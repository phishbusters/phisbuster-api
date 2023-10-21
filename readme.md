# PhishBuster API

PhishBuster API is a backend service designed to handle phishing detection and related activities. This document provides a guide on how to set up the project, understand its architecture, and interact with its endpoints.

## Table of Contents

- [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [MongoDB Setup](#mongodb-setup)
  - [AWS Setup](#aws-setup)
  - [Email Service](#email-service)
- [Architecture](#architecture)
  - [Controllers](#controllers)
  - [Services](#services)
  - [Repositories](#repositories)
  - [Models](#models)
  - [Routes](#routes)
- [API Endpoints](#api-endpoints)

## Installation

### Environment Variables

Rename `.env.template` to `.env` in the root directory of the project in order to get the env variables.

### MongoDB Setup

To run MongoDB locally, you can use Docker Compose. Run the following command to start the MongoDB container:

\`\`\`bash
docker-compose up
\`\`\`

### AWS Setup

1. Sign in to your AWS Management Console.
2. Navigate to IAM (Identity and Access Management).
3. Create a new user and grant it programmatic access.
4. Attach the AmazonS3FullAccess policy to the user.
5. Note down the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

Create an S3 bucket with the name `phish-buster-images`.

### Email Service

Email functionality is not yet implemented. This section will be updated once it's available.

## Architecture

### Controllers

Controllers handle incoming HTTP requests and delegate the business logic to services. They are responsible for sending the HTTP response back to the client.

### Services

Services contain the core business logic of the application. They interact with repositories to perform CRUD operations on the database.

### Repositories

Repositories are responsible for interacting with the database. They perform CRUD operations and return the results back to the services.

### Models

Models define the structure of the database collections. They are used by repositories to interact with the database.

### Routes

Routes define the endpoints of the API. They map HTTP methods and paths to controller functions.

## API Endpoints

A Postman collection named `PhishBusters.postman_collection.json` is included in the project. This collection contains examples of all available endpoints.
