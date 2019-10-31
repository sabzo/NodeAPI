# NOIRFest

This is a NodeJS Express 4.0 API that has an Nginx Reverse Proxy and runs all services inside a Docker Containers. 
The static files are served through Nginx and Nginx proxies all requests to Express. 

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
* Build app: `sudo -E docker-compose --build` 

### TODO
* TODO: 
* TODO: [ssl](https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-3-%E2%80%94-creating-the-docker-compose-file)


