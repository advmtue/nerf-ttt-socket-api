FROM node:14.11.0-stretch

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# Copy source after NPM install so that the build is quicker
ADD src/ src/


EXPOSE 8081
EXPOSE 8082

CMD ["npm", "run", "start"]
