FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Indicate the port on which the app listens
EXPOSE 3333

# Prisma Generate
RUN npx prisma generate

# Command to run the application
CMD ["npm", "start"]
