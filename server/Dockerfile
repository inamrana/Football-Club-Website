# Use official Node.js image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables (can be overridden by Cloud Run)
ENV PORT=3000
ENV NODE_ENV=production

# Start the server
CMD [ "node", "server.js" ]
