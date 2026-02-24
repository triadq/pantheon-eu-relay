FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY package.json ./

# Install dependencies (This generates the missing lockfile on the fly)
RUN npm install

# Bundle app source
COPY . .

# Expose the port
EXPOSE 3000

# Start the proxy
CMD [ "node", "server.js" ]
