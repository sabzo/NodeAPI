# NOIRFest

This is a NodeJS Express 4.0 API that has an Nginx Reverse Proxy and runs all services inside a Docker Containers. 
The static files are served through Nginx and Nginx proxies all requests to Express. 

### Features
* [x] Sets up Nginx as a reverse proxy to the node app.
* [x] Sets up minimal Node express framework
* [x] Creates user registration
* [x] Sets up user authentication using [JSON Web Tokens](https://github.com/auth0/node-jsonwebtoken) using the Bearer Authorization strategy. 
* [x] Connects node app to either local MongoDB database or a remote MongoDB database using a connection string.

### Hosting
* [AWS](https://console.aws.amazon.com)

### Database 
* production: [MongoDB](https://cloud.mongodb.com/)
* local: MongoDB within a Docker container.

### Technology Stack
* [Nginx](https://www.nginx.com/) as a Reverse Proxy for all routes beginning with `/api/`
* [NodeJS 12.30](https://nodejs.org/en/) running [ExpressJS](https://expressjs.com/)
* [Docker-Compose](https://docs.docker.com/compose/) orchestration for
[Docker]() containers. Nginx and the NodeApp both run in containers.

### Usage:

* Install [Docker]()
* Set environment variables defined in `docker-compose.yml`
* Build app: `sudo -E docker-compose --build` 

### Testing
* http api route testing: [httpie](https://github.com/teracyhq/httpie-jwt-auth) library with authentication plugin for JWT.
### TODO
* TODO: [Securing JWT Tokens](https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e)
* TODO: [ssl](https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-3-%E2%80%94-creating-the-docker-compose-file)


