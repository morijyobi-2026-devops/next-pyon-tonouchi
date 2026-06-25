FROM node:20-alpine

# Install deps (including dev deps for development image)
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

# Copy source
COPY . ./

EXPOSE 3000 3001

# Default to API dev server; docker-compose can override to run Next dev
CMD ["npm", "run", "dev"]
