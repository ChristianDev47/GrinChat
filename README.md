# Fullstack Online Chat Application

This project is a fully self-designed and implemented full-stack application for real-time online communication. It includes both a backend API and a frontend interface, each built with modern technologies to provide a robust, scalable, and user-friendly chat system.

## Project Overview

The system is composed of two primary parts:

1. **Backend - Express Chat API**: 
   - Built with **Node.js** and **Express**, this RESTful API manages all the server-side operations, including handling requests, processing messages, managing user sessions, and interacting with the database.
   - The API features a **MongoDB** database and follows an **MVC (Model-View-Controller)** architecture to ensure maintainability and scalability.
   - It includes CRUD operations for various entities such as users, chats, messages, and call records, along with robust authentication and authorization mechanisms using **JWT**.
   - The backend also integrates real-time communication features using **Socket.IO** to handle events like new messages, calls, and notifications.

   For detailed information on the backend, including setup and technologies used, refer to the [Express Chat API Documentation](https://github.com/ChristianDev47/GrinChat/blob/master/Backend/README.md).

2. **Frontend - Chat Application Frontend**:
   - The frontend of the application is built with **Next.js** and **TypeScript**, providing a responsive and dynamic user interface for chat interactions.
   - It offers functionalities such as user registration, login, real-time messaging, managing contacts, initiating audio/video calls, and updating profiles.
   - The frontend uses **CSS Modules** for styling, **React Hook Form** for handling forms, and **Zod** for data validation.
   - It seamlessly integrates with the backend API and Socket.IO for real-time data synchronization, ensuring a smooth user experience.

   For more details on the frontend, including setup instructions and technologies used, check out the [Chat Application Frontend Documentation](https://github.com/ChristianDev47/GrinChat/blob/master/Frontend/README.md).

## Core Features

- **User Authentication**: Secure registration, login, and logout functionalities, managed through the backend API.
- **Real-Time Messaging**: Send and receive messages instantly with real-time updates on message status (delivered, read).
- **Contact Management**: Add, search, and manage contacts, with options for group chats and friend requests.
- **Audio/Video Calls**: Real-time audio and video communication with other users, including call history and status updates.
- **Profile Management**: Users can update their profile information, manage contacts, and customize their chat settings.
- **Notification System**: Real-time notifications for new messages, calls, and friend requests.
- **Responsive Design**: Ensures a seamless user experience across all devices, from desktops to mobile phones.

## Technologies Used

### Backend:
- **Node.js**: The runtime environment for building the API.
- **Express**: The framework used for building the API's routes and middleware.
- **MongoDB**: The NoSQL database for storing persistent data.
- **Mongoose**: ORM for interacting with the MongoDB database.
- **JsonWebToken (JWT)**: For managing user authentication and permissions.
- **Socket.IO**: For handling real-time events and communication.

### Frontend:
- **Next.js**: The framework for building the frontend with server-side rendering.
- **TypeScript**: Provides static typing, ensuring better code quality.
- **CSS Modules**: Provides scoped and modular CSS for styling the application.
- **React Hook Form**: Simplifies form handling and validation.
- **Zod**: A schema validation library for ensuring data integrity.

## Project Structure

- The backend handles all server-side logic, including API endpoints, database interactions, user authentication, and real-time communication.
- The frontend provides a dynamic and responsive user interface, interacting with the backend API and real-time communication channels to display and manage data.

Each part of the project is designed to be modular, allowing for easy maintenance, scaling, and future enhancements.

This project showcases a full-stack approach to building a modern web application, utilizing some of the most popular and powerful tools in web development.

## Demo

You can see the application in action here: [Grinchat Live Demo](https://grinchat.vercel.app/).

![Grinchat](https://raw.githubusercontent.com/ChristianDev47/grinchat/refs/heads/master/Frontend/public/images/grinchat.webp)

