#  Alex-admin
Wed admin for working local users (on linux)

## API settings and start
###  `cd api` 

### create  `touch .env` 
### add vars:

#### HOST_UI=http://10.1.0.182
#### PORT_API=8888 (production)
#### PORT_UI=5000
## Start API server
### `yarn ` 
### `yarn build`
### `yarn server`



## Client settings and start
###  `cd client` 
### create  `touch .env` 
### add vars:

#### REACT_APP_HOST_API=http://10.1.0.182
#### REACT_APP_PORT_API=8888 (production)
##  Client dependencies and build
### `yarn ` 
### `yarn build`

## Static server 
The build folder is ready to be deployed.
You may serve it with a static server:

### `yarn global add serve`
### `serve -s build`

Find out more about deployment here:

####  https://create-react-app.dev/docs/deployment

