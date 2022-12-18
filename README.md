# Career Forum Backend
### [Prerequisite](#prerequisite)
### [Start the Project](#start-the-project)
### [APIs](#apis)



### Prerequisite
- Node.js v18.12.1
- install MySQL Workbench

### Start The Project
- clone this repository
  ```
  $ git clone https://github.com/AdrieneTZ/career-forum-backend.git
  ```

- install package
  ```
  $ npm install
  ```

- create `.gitignore` and `.env` file
  ```
  $ touch .gitignore
  $ touch .env
  ```

- put `.env` and `node-modules` into `.gitignore`
  ```
  node_modules/
  .env
  ```

- follow `.env.example` to set environment variables on `.env`

- migrate database
  ```
  $ npm run migrate
  ```


### APIs
- local base url:
```
http://localhost:3000/api
```
#### User
- user register an account
  ```
  POST /users/register
  ```

- user login
  ```
  POST /users/login
  ```
