# NodeAPI
This is a NodeJS Express 4.0 API that has an Nginx Reverse Proxy and runs all services inside a Docker Containers. 

The static files are served through Nginx and Nginx proxies all requests to Express. 
The static files are located in the Nginx container at /var/www, which is a virtual drive
to local folder `static_files`. The best way to do so is to use a symbolic
link to a folder for frontend content.

### Features
* [x] Sets up Nginx as a reverse proxy to the node app.
* [x] Sets up minimal Node express framework
* [x] Creates user registration
* [x] Create users through invite link
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

* Install [Docker](https://docs.docker.com/install)
* Install [Docker Compose](https://docs.docker.com/compose/install)
* Set environment variables defined in `docker-compose.yml`
* Build & run app: `sudo -E docker-compose up --build` 

### Testing
* `http` api route testing: [httpie](https://github.com/teracyhq/httpie-jwt-auth) library with authentication plugin for JWT.

### TODO
* TODO: [Securing JWT Tokens](https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e)
* TODO: [ssl](https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-3-%E2%80%94-creating-the-docker-compose-file)

### Routes
* Create a user
  * `http post 0.0.0.0/api/user/ email=email@example.com firstName=name1 password=password lastName=name2`
* Invite User by email addres:
  * `http --auth-type=jwt --auth=$token post 0.0.0.0/api/user/invite email=email@example.comI`
* Create user from invite 
  * `http post 0.0.0.0/api/user/from_invite email=ownrepublic@gmail.com 
     inviteID=<invite-id> firstName=<name1> lastName=<name2> password=<password>`
* Retrieve a user
  * `http --auth-type=jwt --auth=$token get 0.0.0.0/api/user/<userid>`
* Retrieve all users
  * `http --auth-type=jwt --auth=$token get 0.0.0.0/api/users`
* Login 
  * `http post 0.0.0.0/api/user/login email=email@example.com password=password`
* Contact Us
  * `http post 0.0.0.0/api/contact_us email=from@example.com message=message-to-send`

### AWS S3
Sample minimum Bucket policy
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObjectAcl",
                "s3:GetObject",
                "s3:CreateBucket",
                "s3:PutObjectAcl"
            ],
            "Resource": [
                "arn:aws:s3:::<bucketname>/*",
                "arn:aws:s3:::<bucketname>"
            ]
        }
    ]
}


#### S3 Direct Upload
<a href="https://devcenter.heroku.com/articles/s3-upload-node#direct-uploading">Tutorial</a>
