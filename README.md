# Jira2postit

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.7.

## Application

This application is the front of jira2postit, a tool that retrieves tickets from your Jira instance and formats them for printing. It aims at making it easier to maintain a physical kanban board along with your team's Jira board.

## Development server

For a dev server, run:
````
ng serve
````
Navigate to `https://localhost:4200/`. The app will automatically reload if you change any of the source files.  
The dev certificate is auto-signed, make a security exception for it.

## Production server with Docker

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
