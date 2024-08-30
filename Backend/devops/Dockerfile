# Use the official Node.js image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy dependency configuration files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code if needed (uncomment if using TypeScript)
# RUN npm run build

# Expose the port your API is listening on
EXPOSE 3000

# Command to run your application
CMD [ "npm", "start" ]
