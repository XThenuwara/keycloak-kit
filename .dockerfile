# Use a Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for both server and client
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies for both server and client
RUN cd ./server && npm install
RUN cd ./client && npm install

# Copy the rest of your server and client code
COPY server ./server/
COPY client ./client/

# Run UI build
RUN cd ./client && npm run build


# Expose the port for your NestJS server (adjust the port if needed)
EXPOSE 3000

# Start your NestJS application (adjust the startup command)
WORKDIR /app/server

CMD ["npm", "run", "start"]
