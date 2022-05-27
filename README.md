# Blog-Backend

## Description
A Backend Server ( based on `node.js` and `express` framework) that gives authors the ability to write and publish their own posts, vlogs, and different articles, besides they can group their content into many categories.
In addition, you can manage the website through a customized dashboard that provides you many permissions to create, edit, and delete authors and manage their content.


## Features

* Store data of users in MongoDB using the `mongoose` framework.
* Store token in cookies and authenticate the user by custom middleware.
* Manage the flow of website by many custom authorize middlewares.
* Upload the media by `Multer` middleware and store them on Cloudinary.
## Installing

* Download the dependencies with `npm` package manager
```
$ npm install
```
## Executing program
* The website workes on `http://localhost:PORT || 8080` OR by `nodemon` developer with monitoring debug terminal

>npm run scripts
```
{
    "scripts": {
        "prettier": "prettier --config .prettierrc 'src/**/*.js' --write",
        "dev": "nodemon index.js 5050",
        "prod": " NODE_ENV=prod node index.js 8080",
        "start": "node index.js"
    }
}
```
## Environment Variables
```
PORT
DBURI_remote
DBURI
TOKENWORD
NODE_ENV

#cloudinary
cloudinary_name
cloudinary_api_key
cloudinary_api_secret
```

## Directory Structure

```
.
|_node_modules/
|_src
|    |_config
|    |_middelwares
|    |_services          #website is divided into small services
|    |    |_model.js
|    |    |_controllers.js            
|    |    |_routes.js
|    |    
|    |_utils
|    |
|    |_index.routes.js
|
|_.env
|_.gitignore
|_index.js
|_package.json
|_README.md
|_LICENSE.md
```
