# Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Instale o nodemon globalmente (opcional)
RUN npm install -g nodemon

CMD ["npm", "run", "dev"]
