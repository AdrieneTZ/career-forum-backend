## Admin APIs
| Feature | HTTP Method | URL |
| ------- | :-----------: | --- |
| [get all users' data with or without approval status](#get-all-users-data-with-or-without-approval-status-get-apiv1adminsusers) | GET | /api/v1/admins/users |
| [change the specific user's approval status](#change-the-specific-users-approval-status-patch-apiv1adminsusersid) | PATCH | /api/v1/admins/users/:id |

<hr style="width:100%;height:2px;text-align:left">

### Get all users' data with or without approval status `GET /api/v1/admins/users`
  - **Request query:**
    | Key | Value | Type | Required |
    | --- | ----- | ---- | :--------: |
    | approvalStatus |  | string | N |
    | page |  | number | N |
    | limit |  | number | N |

  - **Response:**
    - **Success**
      ```json
      // example: no approvalStatus, page: 1, limit: 10

      status code: 200

      {
        "status": "success",
        "message": "Get users.",
        "count": 10,
        "users": [
          {
            "id": 22,
            "role": "TA",
            "name": "admin",
            "email": "admin@admin.com",
            "approvalStatus": "reviewing",
            "avatar": null,
            "createdAt": "2023-02-06T06:46:29.911Z"
          },
          {
            "id": 20,
            "role": "TA",
            "name": "King",
            "email": "admin@careerForum.com",
            "approvalStatus": "approved",
            "avatar": null,
            "createdAt": "2023-02-02T17:38:27.851Z"
          },
          ...
        ]
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

    - **Error: permission role is not "admin"**
      ```json
      status code: 403

      {
        "status": "error",
        "message": "Forbidden permission role"
      }
      ```

    - **Error: not any user data in database**
      ```json
      status code: 404

      {
        "status": "error",
        "message": "Users' data are not found."
      }
      ```

<hr style="width:100%;height:2px;text-align:left">

### Change the specific user's approval status `PATCH /api/v1/admins/users/:id`
  - **Request params:**
    | Key | Value | Type | Required |
    | --- | ----- | ---- | :--------: |
    | id |  | number | Y |

  - **Request body:**
    | Key | Value | Type | Required |
    | --- | ----- | ---- | :--------: |
    | approvalStatus | reviewing, approved or rejected | string | Y |

  - **Response:**
    - **Success**
      ```json
      status code: 200,

      {
        "status": "success",
        "message": "Update approvalStatus",
        "updatedUser": {
          "id": 21,
          "role": "student",
          "name": "user",
          "email": "user@careerForum.com",
          "approvalStatus": "approved",
          "avatar": null,
          "cover": null,
          "createdAt": "2023-02-02T17:38:27.851Z",
          "updatedAt": "2023-02-07T15:56:39.967Z",
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

    - **Error: permission role is not "admin"**
      ```json
      status code: 403

      {
        "status": "error",
        "message": "Forbidden permission role"
      }
      ```

    - **Error: not any user data in database**
      ```json
      status code: 404

      {
        "status": "error",
        "message": "Users' data are not found."
      }
      ```

    - **Error: admin is not allowed to change admin's approvalStatus.**
      ```json
      status code: 403

      {
        "status": "error",
        "message": "Admin is not allowed to change admin's approvalStatus."
      }
      ```
