<p align="center">
  <img src="https://github.com/worldline/jira2postit-front/blob/master/src/assets/jira2postit-logo.png" width="100" height="100">
</p>

# Jira2postit

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![Open Source Love png1](https://badges.frapsoft.com/os/v1/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![GitHub issues](https://img.shields.io/github/issues/Naereen/StrapDown.js.svg)](https://github.com/worldline/jira2postit-front/issues/)

## Getting started

This application is the front of jira2postit, a tool that retrieves tickets from your Jira instance and formats them for printing. It aims at making it easier to maintain a physical kanban board along with your team's Jira board. In very few easy steps, you can have all the post-its ready to be stuck on your physical board:

### 1. Sign in

Sign in using you usual Jira credentials. This will allow Jira2Postit to query the jira server to display the tickets in your board.

### 2. Configure the printing

You can choose choose which types of tickets to print and in which size.

<p align="center">
  <img src="https://github.com/worldline/jira2postit-front/blob/master/src/assets/configuration.png" width="800">
</p>


### 3. Choose the tickets

#### Scrum boards

<p align="center">
  <img src="https://github.com/worldline/jira2postit-front/blob/master/src/assets/sprint-selection.png" width="800">
</p>

#### Kanban boards

<p align="center">
  <img src="https://github.com/worldline/jira2postit-front/blob/master/src/assets/kanban.png" width="800">
</p>

### 4. Stick the post-its on a template sheet and print

<p align="center">
  <img src="https://github.com/worldline/jira2postit-front/blob/master/src/assets/printing-steps.png" width="800">
</p>

### 5. Fill your physical board

<p align="center">
  <img src="https://github.com/worldline/jira2postit-front/blob/master/src/assets/physical-board.jpg" width="400">
</p>

## Develop

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.7. It is updated regularly and is currently using Angular 10.

For a dev server, run:
````
npm install
ng serve
````
Navigate to `https://localhost:4200/`. The app will automatically reload if you change any of the source files.  
The dev certificate is auto-signed, make a security exception for it.
You will need to also have [jira2postit middleware](https://github.com/worldline/jira2postit-middleware) up. It is a middleware between the Angular application and your Jira server.

## Deploy to a production server with Docker

- Build the image:
```
docker build -t image-name .
```

- Run the container with the default nginx configuration:
```
docker run -d -p port-of-your-choice:443 image-name
```

- Run with a custom nginx configuration:   
Mount a volume where your nginx configuration is.
```
docker run -d -p port-of-your-choice:443 --name container-name -v nginx/configuration/path/on/host:/etc/nginx/conf.d/j2postit.conf image-name
```

- Full exemple:   
If you have a custom nginx configuration file in the folder /tmp/conf and to make the website available on port 4444, this is the command to type
```
docker build -t jira2postit .

docker run -d -p 4444:443 --name jira2postit -v tmp/conf/j2postit.conf:/etc/nginx/conf.d/j2postit.conf:/etc/nginx/conf.d/j2postit.conf jira2postit
