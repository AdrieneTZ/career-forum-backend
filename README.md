# Career Forum Backend
## Introduction
Career Forum is a forum for AC TAs, alumni and students to ask the questions and share their answers on job finding.

- Qualification for registering:
  - All AC TAs
  - All students that are at the third semester
  - Attended the the third semester and graduated from AC

## Contents
### [Prerequisite](#prerequisite)
### [Start the Project](#start-the-project)
### [APIs](#apis)
- [User](#user)
  - [User register an account](#user-register-an-account)
  - [User login](#user-login)



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
#### Local Environment Base Url:
```
http://localhost:3000/api
```
#### User
##### User register an account
  ```
  POST /users/register
  ```

  - **requset body:**
    ```json
    {
      "role": "string" (required),
      "email": "string" (required),
      "account": "string" (required),
      "password": "string" (required),
      "confirmPassword": "string" (required)
    }
    ```

  - **response:**
    - **success**
      ```json
      status code: 201
      ```

    - **missing data**
      ```json
      status code: 400

      {
        "type": "Register failed",
        "field_errors": {
          "role": "required",
          "email": "required",
          "account": "required",
          "password": "required",
          "confirmPassword": "required"
        }
      }
      ```

    - **incorrect data type**
       ```json
      status code: 400

      {
        "type": "Register failed",
        "field_errors": {
          "role": "string",
          "email": "string",
          "account": "string",
          "password": "string",
          "confirmPassword": "string"
        }
      }
      ```

    - **email or account has been used**
      ```json
      status code: 400

      {
        "type": "Register failed",
        "field_errors": {
          "email": "used",
          "account": "used"
        }
      }
      ```

##### User login
  ```
  POST /users/login
  ```

  - **requset body:**
    ```json
    {
      "account": "string" (required),
      "password": "string" (required)
    }
    ```

  - **response:**
    - **success**
      ```json
      status code: 200

      {
        "token": "a set of token"
      }
      ```

    - **missing data**
      ```json
      status code: 400

      {
        "type": "Login failed",
        "field_errors": {
          "account": "required",
          "password": "required"
        }
      }
      ```

    - **incorrect data type**
       ```json
      status code: 400

      {
        "type": "Login failed",
        "field_errors": {
          "account": "string",
          "password": "string"
        }
      }
      ```

    - **incorrect account or password**
      ```json
      status code: 400

      {
        "type": "Login failed",
        "field_errors": {
          "account": "incorrect",
          "password": "incorrect"
        }
      }
      ```
