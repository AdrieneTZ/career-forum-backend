## User APIs
| Feature | HTTP Method | URL |
| ------- | :-----------: | --- |
| [user register](#user-register-post-apiv1register) | POST | /api/v1/register |
| [user login](#user-login-post-apiv1login) | POST | /api/v1/login |
| get current user data | GET | /api/v1/users/current_user |
| get the specific user's data | GET | /api/v1/users/:id |
| edit the specific user's profile data | PUT | /api/v1/users/:id/profile |
| edit the specific user's account setting | PUT | /api/v1/users/:id/setting |
| delete the specific user's avatar | PATCH | /api/v1/users/:id/avatar |
| delete the specific user's cover photo | PATCH | /api/users/:id/cover |


### User register `POST /api/v1/register`
  - **Requset body:**
    ```json
    {
      "role": "string" (required),
      "email": "string" (required and unique),
      "name": "string" (required),
      "password": "string" (required),
      "confirmPassword": "string" (required)
    }
    ```

  - **Response:**
    - **Success**
      ```json
      status code: 201

      {
        "status": "success",
        "message": "Register successfully",
        "user": {
          "id": 22,
          "role": "TA",
          "name": "admin",
          "email": "admin@admin.com",
          "approvalStatus": "reviewing",
          "avatar": null,
          "cover": null,
          "createdAt": "2023-02-06T06:46:29.911Z",
          "updatedAt": "2023-02-06T06:46:29.911Z",
          "permissionRole": "user",
          "suspendedAt": null,
          "deletedAt": null
        }
      }
      ```

    - **Error: incorrect data type**
       ```json
      status code: 400

      {
        "status": "400FT",
        "message": "Field: role, email, name, password, confirmPassword must be string."
      }
      ```

    - **Error: email, password, or confirmPassword contain white space**
      ```json
      status code: 400

      {
        "status": "400FS",
        "message": "Field: white space is not allowed in    email, password or confirmPassword."
      }
      ```

    - **Error: missing required data**
      ```json
      status code: 400

      {
        "status": "400FR",
        "message": "Field: role, email, name, password, confirmPassword are required."
      }
      ```

    - **Error: name length is more than 20 chatacters**
      ```json
      status code: 400

      {
        "status": "400FL",
        "message": "Field: name length has to be less than 20 characters."
      }
      ```

    - **Error: password and confirmPassword are not matched**
      ```json
      status code: 400
      {
          "status": "400FM",
          "message": "Field: password and confirmPassword are not matched."
      }
      ```

    - **Error: role is not one of three: TA, graduate or student**
      ```json
      status: 400

      {
        "status": "400FR",
        "message": "Field: role has to be one of these three: TA, graduate, student."
      }
      ```

    - **Error: email has been used**
      ```json
      status code: 400

      {
        "status": "400FD",
        "message": "Field: email has been used."
      }
      ```

### User login `POST /api/v1/login`
  - **Requset body:**
    ```json
    {
      "email": "string" (required),
      "password": "string" (required)
    }
    ```

  - **Response:**
    - **Success**
      ```json
      status code: 201

      {
        "token": "token"
      }
      ```

    - **Error: incorrect data type**
      ```json
      status code: 400

      {
          "status": "400FT",
          "message": "Field: email and password must be string."
      }
      ```

    - **Error: email or password contain white space**
      ```json
      status code: 400

      {
        "status": "400FS",
        "message": "Field: white space is not allowed in email or password."
      }
      ```
    - **Error: missing required data**
      ```json
      status code: 400

      {
        "status": "400FR",
        "message": "Field: role, email, name, password, confirmPassword are required."
      }
      ```

    - **Error: user doesn't have an account**
      ```json
      status code: 401

      {
        "status": "error",
        "message": "Error: User does not exist!"
      }
      ```

    - **Error: incorrect password**
      ```json
      status code: 401

      {
        "status": "error",
        "message": "Error: Passwords do not match!"
      }
      ```

 - ****
      ```json
      ```
