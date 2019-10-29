FROM node:12.13.0
# using Node 12 LTS (Long Term Support)
MAINTAINER Sabelo Mhlambi
WORKDIR /home/app

COPY package*.json ./
EXPOSE 8080
RUN npm install

COPY . .
CMD ["node", "app.js"]
