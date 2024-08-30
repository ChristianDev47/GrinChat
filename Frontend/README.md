# Online Chat Application Frontend

A modern and responsive frontend application built with **Next.js** and **TypeScript**, designed for seamless real-time communication. This application was bootstrapped with **Vite** for fast development and uses **CSS Modules** for styling. It offers an intuitive user interface for chatting, managing contacts, handling user profiles, and making audio/video calls.

## Core Features

- **User Registration and Authentication**: Users can register via email, log in, and log out securely.
- **Main Chat Dashboard**: Displays a grid layout with two main sections: contacts/chats and the chat conversation area.
- **Contacts and Chats Management**: 
  - **Contacts Section**: Includes a navbar with options for searching users, sending friend requests, managing conversation requests, starting new chats or groups, viewing call history, and accessing profile settings.
  - **Chat Section**: Displays the list of conversations with contacts and groups, along with a search bar and filters for all chats, unread chats, and group chats.
  - **Conversation View**: Shows the ongoing chat with messages, files, images, and more. Includes options for sending text messages, emojis, files, and voice recordings.

- **User Profile Management**: Users can update their personal information, including profile picture, name, surname, email, and status.
- **Friend Requests**: Send and manage friend requests, with real-time updates on acceptance or rejection.
- **Audio/Video Calls**: 
  - **Audio Calls**: Initiate, mute, and end calls, with real-time status updates and audio cues for waiting and calling.
  - **Video Calls**: Similar to audio calls, with additional options to enable/disable the camera.
- **Group Chats**: Create and manage group chats with options for adding participants and managing group information.
- **Real-Time Messaging**: Send and receive messages, files, and images in real-time with status indicators for message delivery and read receipts.

### Additional Features

- **Protected Routes**: Uses Next.js middleware to secure routes, ensuring that only authenticated users can access specific sections.
- **State Management**: Efficient state handling for user sessions, contacts, chats, and call management.
- **Notification System**: Real-time feedback using **React Hot Toast** for actions like sending friend requests, updating profile information, or starting new chats.
- **Data Validation**: Robust validation with **Yup** and **Zod** to ensure data integrity throughout the application.
- **Interactive UI Elements**: Utilizes **Framer Motion** and **React Spring** for smooth animations and transitions.

## Technologies Used

- **Next.js**: The core framework for building the frontend.
- **Vite**: Fast and modern build tool for front-end projects.
- **TypeScript**: Strongly-typed language that improves code quality and maintainability.
- **CSS Modules**: Provides scoped and modular CSS for styling the application.
- **js-cookie**: For managing cookies, particularly for authentication tokens.
- **react-hook-form**: Simplifies form handling and validation.
- **React Hot Toast**: Provides user-friendly notifications throughout the application.
- **Framer Motion**: For creating smooth animations and enhancing the user experience.
- **Zod** and **Yup**: Schema validation libraries ensuring data correctness.

## Overview

This frontend application is designed to offer a seamless and responsive chat experience, integrating modern technologies to ensure real-time communication, secure user management, and an intuitive interface. Whether users are chatting with friends, managing contacts, or making calls, the application provides a smooth and enjoyable experience across all devices.
