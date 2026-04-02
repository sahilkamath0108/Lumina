# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose backend port
EXPOSE 5500

# Start server
# CMD ["npm", "start"]
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]