# Chat Online API

A robust online chat API built with Node.js and Express, designed to efficiently handle real-time communication. The API uses a MongoDB database and follows the MVC (Model-View-Controller) architecture for clear and maintainable code organization.

## Core Features
The API provides CRUD operations (Create, Read, Update, Delete) for managing various entities within the system:

- **Users**: Manage user personal information, authentication, and contacts.
- **Messages**: Send, receive, and manage messages in various formats (text, audio, video, etc.).
- **Chats**: Manage conversations between users, both individual and group.
- **Group Chats**: Manage groups, including participants, roles, and statuses.
- **Calls**: Initiate and manage audio and video calls between users.

### Additional Features
- **User Registration**: Allows new users to register using their email addresses.
- **User Authentication**: Secure login and logout functionality with access token management.
- **Friend Requests**: Send, accept, and reject friend requests between users.
- **Real-Time Notifications**: Update notifications, friend requests, and other events in real-time using Socket.io.
- **File Sending**: Allows sending of multimedia files between users.
- **API Documentation**: Detailed API documentation generated automatically with Swagger.
- **Dockerization**: The API is Dockerized to ensure a consistent environment in both development and production.

## Technologies Used
- **Node.js**: Core platform for running the server.
- **Express**: Framework used for building the API.
- **Mongoose**: ODM (Object Data Modeling) for MongoDB.
- **Socket.io**: Library for handling real-time communication.
- **Bcrypt**: Used for secure password encryption.
- **JsonWebToken (JWT)**: Manages authentication and permissions via JWT tokens.
- **Cloudinary**: Storage and management of multimedia files.
- **Multer**: Middleware for handling file uploads.
- **Swagger**: Tool for creating interactive API documentation.
- **Zod**: Library for data validation.
- **Jest**: Testing framework used for unit and integration tests.
- **Supertest**: Tool for HTTP testing of the API.
- **Docker**: Containerization of the application to ensure a consistent environment.

## Database Architecture
The database is structured to efficiently handle relationships between users, messages, chats, and calls. Below is an Entity-Relationship diagram representing the database structure:

![ER-Diagram](https://raw.githubusercontent.com/ChristianDev47/GrinChat/refs/heads/master/Backend/src/models/database/diagram/ER_Diagram.png)
