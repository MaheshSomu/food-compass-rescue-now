Project Title:

Food Compass - Rescue Now


Project Overview

Food Compass - Rescue Now is a platform designed to combat food waste and help those in need. This project visualizes food rescue locations on a dynamic map and provides tools for effective resource management.

Features

- Interactive Maps: Visualize food rescue locations dynamically.
- Modern UI: Built with shadcn-ui and Tailwind CSS for clean and responsive design.
- Database Integration: Efficient data management using MongoDB.
- TypeScript Integration: Ensures type safety and robust code.

Technologies Used

This project utilizes the following technologies:
- Vite: A fast development environment.
- React: Enables modular and reusable component-based UI development.
- TypeScript: Strong typing ensures cleaner and more predictable code.
- Tailwind CSS: For styling with utility-first principles.
- shadcn-ui: Enhances the user interface with robust UI components.
- Leaflet: Open-source library for map visualizations.
- MongoDB: A NoSQL database for scalable and efficient data storage.


Installation Guide

Prerequisites
- Install Node.js and npm using nvm.
- Install MongoDB locally or set up a cloud-based MongoDB Atlas cluster.

Steps
- Clone this repository:git clone <YOUR_GIT_URL>

- Navigate to the project directory:cd <YOUR_PROJECT_NAME>

- Install dependencies:npm install

- Start the development server:npm run dev

- Configure the MongoDB connection string in your environment file or database configuration file.

Database Setup
- Create a MongoDB database (e.g., food-rescue).
- Define the collections:- Locations: To store rescue location details (e.g., name, address, coordinates).
- Users: To store user information (e.g., name, email).

- Add sample data in JSON format, for example:{
  "name": "Community Food Rescue",
  "address": "123 Food Lane",
  "latitude": 37.7749,
  "longitude": -122.4194
}

Map Integration
Interactive maps are implemented using Leaflet and OpenStreetMap.
- Install Leaflet:npm install leaflet

- Import Leaflet and its CSS in your MapComponent:import L from "leaflet";
import "leaflet/dist/leaflet.css";

- Initialize the map with default coordinates:useEffect(() => {
  const map = L.map("map").setView([51.505, -0.09], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
}, []);

Deployment Guide
Steps
- Push your project to a version control repository (e.g., GitHub or GitLab).
- Use hosting platforms like Netlify, Vercel, or Heroku to deploy the application.
- Ensure the MongoDB connection string points to a production database using environment variables.


How to Contribute
We welcome contributions! To contribute:
- Fork this repository.
- Create a new branch:git checkout -b feature/new-feature

- Commit and push your changes:git add .
git commit -m "Added a new feature"
git push origin feature/new-feature

- Open a Pull Request for review.



















