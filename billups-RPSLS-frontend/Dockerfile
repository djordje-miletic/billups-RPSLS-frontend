FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port that the dev server uses
EXPOSE 3000

# Start the dev server
CMD ["npm", "run", "dev"]