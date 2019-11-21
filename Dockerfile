# étape de build
FROM node:10-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build-prod

# étape de production
FROM nginx:alpine as production-stage

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist/jira2postit /usr/share/nginx/html
COPY nginx-conf/j2postit.conf /etc/nginx/conf.d/j2postit.conf
COPY ssl/server.crt /etc/nginx/certificates/cert.pem
COPY ssl/server.key /etc/nginx/certificates/key.pem

EXPOSE 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]
