# Imagem base
FROM node:18-alpine
WORKDIR /app
# Copia e instala dependências
COPY package*.json ./
RUN npm install
# Copia o código fonte
COPY . .
# Expõe a porta e roda
EXPOSE 3000
CMD ["node", "app.js"]