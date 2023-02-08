## User APIs
| Feature | HTTP Method | URL |
| ------- | :-----------: | --- |
| [user register](#user-register-post-apiv1register) | POST | /api/v1/register |
| [user login](#user-login-post-apiv1login) | POST | /api/v1/login |
| [get current user data](#get-current-user-data-get-apiv1userscurrent_user) | GET | /api/v1/users/current_user |
| [get the specific user's data](#get-the-specific-users-data-get-apiv1usersid) | GET | /api/v1/users/:id |
| [edit the specific user's profile data](#edit-the-specific-users-profile-data-put-apiv1usersidprofile) | PUT | /api/v1/users/:id/profile |
| [edit the specific user's account setting](#edit-the-specific-users-account-setting-put-apiv1usersidsetting) | PUT | /api/v1/users/:id/setting |
| [delete the specific user's avatar](#delete-the-specific-users-avatar-patch-apiv1usersidavatar) | PATCH | /api/v1/users/:id/avatar |
| [delete the specific user's cover photo](#delete-the-specific-users-cover-photo-patch-apiv1usersidcover) | PATCH | /api/users/:id/cover |

<hr style="width:100%;height:2px;text-align:left">

### User register `POST /api/v1/register`
  - **Requset body:**
    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | role | TA, graduate, or student | string | Y |
    | email |  | string | Y & unique |
    | name |  | string | Y |
    | password |  | string | Y |
    | confirmPassword |  | string | Y |

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
      status code: 400

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

<hr style="width:100%;height:2px;text-align:left">

### User login `POST /api/v1/login`
  - **Requset body:**
    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | email |  | string | Y |
    | password |  | string | Y |

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

<hr style="width:100%;height:2px;text-align:left">

### Get current user data `GET /api/v1/users/current_user`
  - **Requset body:** No request body

  - **Response:**
    - **Success**
      ```json
      status code: 200

      {
        "status": "success",
        "message": "Get current user.",
        "user": {
            "id": 18,
            "role": "graduate",
            "name": "sean",
            "email": "sean@careerForum.com",
            "avatar": null,
            "cover": null,
            "createdAt": "2023-02-02T17:38:27.645Z",
            "updatedAt": "2023-02-03T11:58:41.550Z",
            "permissionRole": "user"
        }
      }
      ```

    - **Error: request without qualified token**
      ```json
      status code: 401

      {
        "status": "error",
        "message": "Unauthorized"
      }
      ```

    - **Error: approval status is not "approved"**
      ```json
      status code: 403

      {
        "status": "error",
        "message": "Forbidden approvalStatus"
      }
      ```

    - **Error: current user data doesn't exist**
      ```json
      status code: 404

      {
        "status": "error",
        "message": "User does not exist."
      }
      ```

<hr style="width:100%;height:2px;text-align:left">

### Get the specific user's data `GET /api/v1/users/:id`
  - **Requset params:**
    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | id |  | number | Y |

  - **Response:**
    - **Success**
      ```json
        status code: 200,

        {
          "status": "success",
          "message": "Get specific user.",
          "user": {
              "id": 20,
              "role": "TA",
              "name": "admin",
              "email": "admin@careerForum.com",
              "avatar": null,
              "cover": null,
              "approvalStatus": "approved",
              "createdAt": "2023-02-02T17:38:27.851Z",
              "updatedAt": "2023-02-02T17:38:27.851Z"
          }
        }
      ```
    - **Error: request without qualified token**
      ```json
      status code: 401

      {
        "status": "error",
        "message": "Unauthorized"
      }
      ```

    - **Error: approval status is not "approved"**
      ```json
      status code: 403

      {
        "status": "error",
        "message": "Forbidden approvalStatus"
      }
      ```

    - **Error: user data doesn't exist**
      ```json
      status code: 404

      {
        "status": "error",
        "message": "User does not exist."
      }
      ```

<hr style="width:100%;height:2px;text-align:left">

### Edit the specific user's profile data `PUT /api/v1/users/:id/profile`
  - **Request params:**
    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | id |  | number | Y |

  - **Request body:**
    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | role | TA, graduate, or student | string | Y |
    | name |  | string | Y |

  - **Response:**
    - **Success**
      ```json
      status code: 200,

      {
        "status": "success",
        "message": "Update user profile.",
        "user": {
          "id": 20,
          "role": "TA",
          "name": "King",
          "email": "admin@careerForum.com",
          "approvalStatus": "approved",
          "avatar": null,
          "cover": null,
          "createdAt": "2023-02-02T17:38:27.851Z",
          "updatedAt": "2023-02-07T08:57:53.099Z",
          "permissionRole": "admin",
          "suspendedAt": null,
          "deletedAt": null
        }
      }
      ```

    - **Error: request without qualified token**
      ```json
      status code: 401

      {
        "status": "error",
        "message": "Unauthorized"
      }
      ```

    - **Error: approval status is not "approved"**
      ```json
      status code: 403

      {
        "status": "error",
        "message": "Forbidden approvalStatus"
      }
      ```

    - **Error: current user has no right to edit other user's data**

      ```json
      status code: 403

      {
        "status": "error",
        "message": "You can only edit your own profile data"
      }

    - **Error: missing required data**
      ```json
      status code: 400

      {
        "status": "400FR",
        "message": "Field: role and name are required."
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

    - **Error: user data doesn't exist**
      ```json
      status code: 404

      {
        "status": "error",
        "message": "User is not found."
      }

<hr style="width:100%;height:2px;text-align:left">

### Edit the specific user's account setting `PUT /api/v1/users/:id/setting`

  - **Request params:**
    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | id |  | number | Y |

  - **Request body:**
    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | oldPassword |  | string | Y |
    | password |  | string | Y |
    | confirmPassword |  | string | Y |

  - **Response:**
    - **Success**
      ```json
      status code: 200,

      {
        "status": "success",
        "message": "Update user setting.",
        "user": {
          "id": 18,
          "role": "graduate",
          "name": "sean",
          "email": "sean@careerForum.com",
          "approvalStatus": "approved",
          "avatar": null,
          "cover": null,
          "createdAt": "2023-02-02T17:38:27.645Z",
          "updatedAt": "2023-02-07T13:45:27.695Z",
          "permissionRole": "user",
          "suspendedAt": null,
          "deletedAt": null
        }
      }
      ```
    - **Error: request without qualified token**
      ```json
      status code: 401

      {
        "status": "error",
        "message": "Unauthorized"
      }
      ```

    - **Error: approval status is not "approved"**
      ```json
      status code: 403

      {
        "status": "error",
        "message": "Forbidden approvalStatus"
      }
      ```

    - **Error: current user has no right to edit other user's data**
      ```json
      status code: 403

      {
        "status": "error",
        "message": "You can only edit your own profile data"
      }
      ```

    - **Error: oldPassword, password or confirmPassword contain white space**
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
          "message": "Field: oldPassword, password and confirmPassword are required."
        }
        ```

    - **Error: oldPassword, password and confirmPassword length have to be more than 8 chatacters**
      ```json
      status code: 400

      {
        "status": "400FL",
        "message": "Field: password and confirmPassword length have to be more than 8 characters."
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

    - **Error: user data doesn't exist**
      ```json
      status code: 404

      {
        "status": "error",
        "message": "User is not found."
      }
      ```

    - **Error: the entered oldPassword and the existing one in the database are not matched**
      ```json
      status code: 401

      {
        "status": "error",
        "message": "Error: Wrong oldPassword."
      }
      ```

    - **Error: the password of admin account for testing can't be changed"
      ```json
      status code: 403

      {
        "status": "error",
        "message": "Admin-testing account's password can not be modified."
      }
      ```

<hr style="width:100%;height:2px;text-align:left">

### Delete the specific user's avatar `PATCH /api/v1/users/:id/avatar`

- **Request params:**
  | KEY | VALUE | TYPE | REQUIRED |
  | --- | ----- | ---- | :--------: |
  | id |  | number | Y |

- **Response:**
  - **Success**
    ```json
    status code: 200,

    {
      "status": "success",
     "message": "Delete cover.",
      "user": {
        "id": 18,
        "cover": ""
      }
    }
    ```

  - **Error: request without qualified token**
    ```json
    status code: 401

    {
      "status": "error",
      "message": "Unauthorized"
    }
    ```

  - **Error: approval status is not "approved"**
    ```json
    status code: 403

    {
      "status": "error",
      "message": "Forbidden approvalStatus"
    }
    ```

  - **Error: current user has no right to edit other user's data**
    ```json
    status code: 403

    {
      "status": "error",
      "message": "You can only edit your own profile data"
    }
    ```

  - **Error: user data doesn't exist**
    ```json
    status code: 404

    {
      "status": "error",
      "message": "User is not found."
    }
    ```

<hr style="width:100%;height:2px;text-align:left">

### Delete the specific user's cover photo `PATCH /api/v1/users/:id/cover`

- **Request params:**
    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | id |  | number | Y |

- **Response:**
  - **Success**
    ```json
    status code: 200,

    {
      "status": "success",
      "message": "Delete avatar.",
      "user": {
        "id": 18,
        "avatar": ""
      }
    }
    ```

  - **Error: request without qualified token**
    ```json
    status code: 401

    {
      "status": "error",
      "message": "Unauthorized"
    }
    ```

  - **Error: approval status is not "approved"**
    ```json
    status code: 403

    {
      "status": "error",
      "message": "Forbidden approvalStatus"
    }
    ```

  - **Error: current user has no right to edit other user's data**
    ```json
    status code: 403

    {
      "status": "error",
      "message": "You can only edit your own profile data"
    }
    ```

  - **Error: user data doesn't exist**
    ```json
    status code: 404

    {
      "status": "error",
      "message": "User is not found."
    }
    ```


