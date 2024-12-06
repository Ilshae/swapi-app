# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
