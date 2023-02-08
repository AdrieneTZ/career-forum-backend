## Answer APIs
| Feature                    | HTTP Method | URL                           |
| -------------------------- | :---------: | ----------------------------- |
| [create an answer](#answers-postanswer-post-apiv1questionsidanswers)           |    POST     | /api/v1/questions/:id/answers |
| [get the specific answer](#answers-getanswer-get-apiv1answersid)    |     GET     | /api/v1/answers/:id           |
| [edit the specific answer](#answers-putanswer-put-apiv1answersid)   |     PUT     | /api/v1/answers/:id           |
| [delete the specific answer](#answers-deleteanswer-delete-apiv1answersid) |   DELETE    | /api/v1/answers/:id           |


### Answers postAnswer `POST /api/v1/questions/:id/answers`
  - **Parameters:**

    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | id  | 1     | number | Y |

  - **Requset body:**
    ```json
    {
      "content":"testQ1A1"
    }
    ```

  - **Response:**
    - **Success**

      ```json
      status code: 200

      {
        "status": "success",
        "message": "Create an answer.",
        "answer": {
        "id": 145,
        "content": "testQ1A1",
        "createdAt": "2023-02-07T09:36:20.320Z",
        "updatedAt": "2023-02-07T09:36:20.320Z",
        "userId": 5,
        "questionId": 1
        }
      }
      ```

    - **Error:**
       ```json
      status code: 400

      {
        "status": "400FR",
        "message": "Field: content is required."
      }
      ```

    - **Error:**
       ```json
      status code: 400

      {
        "status": "400FT",
        "message": "Field: datatype of the content must be string."
      }
      ```

    - **Error:**
       ```json
      status code: 400

      {
        "status": "400FL",
        "message": "Field: content length must be less than 2000 characters."
      }
      ```

### Answers getAnswer `GET /api/v1/answers/:id`
  - **Parameters:**

    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | id  | 1     | number | Y |

  - **Response:**
    - **Success**

      ```json
      status code: 200

      {
        "status": "success",
        "message": "Get the specific answer.",
        "answer": {
            "id": 1,
            "content": "Ipsum fuga asperiores aperiam sit provident beatae esse atque sapiente.",
            "createdAt": "2023-02-07T07:27:14.985Z",
            "updatedAt": "2023-02-07T07:27:14.985Z",
            "userId": 5,
            "questionId": 13
        }
      }
      ```

    - **Error: data not found**
       ```json
      status code: 404

      {
        "status": "error",
        "message": "The specific answer is not found."
      }
      ```

### Answers putAnswer `PUT /api/v1/answers/:id`
  - **Parameters:**

    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | id  | 145   | number | Y |

  - **Requset body:**
    ```json
    {
      "content":"testPutQ1A1"
    }
    ```

  - **Response:**
    - **Success**

      ```json
      status code: 200

      {
        "status": "success",
        "message": "The specific answer is updated.",
        "updatedAnswer": {
            "id": 145,
            "content": "testPutQ1A1",
            "createdAt": "2023-02-07T09:36:20.320Z",
            "updatedAt": "2023-02-07T09:48:29.048Z",
            "userId": 5,
            "questionId": 1
        }
      }
      ```

    - **Error: data not found**
       ```json
      status code: 404

      {
        "status": "error",
        "message": "The specific answer is not found."
      }
      ```

    - **Error:**
       ```json
      status code: 403

      {
        "status": "error",
        "message": "Current user can only edit his own answer."
      }
      ```

    - **Error:**
       ```json
      status code: 400

      {
        "status": "400FR",
        "message": "Field: content is required."
      }
      ```

    - **Error:**
       ```json
      status code: 400

      {
        "status": "400FT",
        "message": "Field: datatype of the content must be string."
      }
      ```

    - **Error:**
       ```json
      status code: 400

      {
        "status": "400FL",
        "message": "Field: content length must be less than 2000 characters."
      }
      ```

### Answers deleteAnswer `DELETE /api/v1/answers/:id`
  - **Parameters:**

    | KEY | VALUE | TYPE | REQUIRED |
    | --- | ----- | ---- | :--------: |
    | id  | 145    | number | Y |

  - **Response:**
    - **Success**

      ```json
      status code: 200

      {
        "status": "success",
        "message": "The specific answer is deleted.",
        "deletedAnswer": {
            "id": 145,
            "content": "testPutQ1A1",
            "createdAt": "2023-02-07T09:36:20.320Z",
            "updatedAt": "2023-02-07T09:48:29.048Z",
            "userId": 5,
            "questionId": 1
        }
      }
      ```

    - **Error: data not found**
       ```json
      status code: 404

      {
        "status": "error",
        "message": "The specific answer is not found."
      }
      ```

    - **Error:**
       ```json
      status code: 403

      {
        "status": "error",
        "message": "Current user can only delete his own answer."
      }
      ```
