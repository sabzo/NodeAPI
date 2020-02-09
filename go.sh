# For AWS functionality
export AWS_ACCESS_KEY_ID=''
export AWS_SECRET_ACCESS_KEY=''
export S3_BUCKET=''
export AWS_REGION=''
# server  details
export HOST='0.0.0.0'
export PORT='8080'
# Session Info
export JWTSECRET='<SOME RANDOM JWT SECRET GOES HERE>'
export SESSION_SECRET='<SOME SESSION SECRET GOES HERE>'
# Sendgrid
export SENDGRID_EMAIL_ADDRESS='from@example.com'
# Company Info
export COMPANY_NAME='Our Company'
# Start app
sudo -E docker-compose up --build
