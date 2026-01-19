# NSCC Hackathon '26: Team Syntax Error Geeks

## Getting started

**Requirements**

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)


**Starting up**

Ensure docker desktop is running. In the root of the repository run this command:

```pwsh
docker compose up
```

Starting the docker compose will build the database and start all of the services required to run the app.

The app features are available at:

- Frontend: http://localhost:9000/
- Backend: http://localhost:9000/api/
- Backend docs: http://localhost:9000/api/docs


**Stopping**

Press `Ctrl + C`


**Starting up (detached)**

```pwsh
docker compose up -d
```


**Stopping (detached)**

```pwsh
docker compose down
```
