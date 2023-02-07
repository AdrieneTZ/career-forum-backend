## Question APIs
| Feature                                  | HTTP Method | URL                           |
| ---------------------------------------- | :---------: | ----------------------------- |
| create an question                       |    POST     | /api/v1/questions             |
| get the specific question                |     GET     | /api/v1/questions/:id         |
| get all questions                        |     GET     | /api/v1/questions             |
| get all answers of the specific question |     GET     | /api/v1/questions/:id/answers |
| edit the specific question               |     PUT     | /api/v1/questions/:id         |
| delete the specific question             |   DELETE    | /api/v1/questions/:id         |


### Question postQuestion `POST /api/v1/questions`
  - **Requset body:**
    ```json
    {
      "title":"testQ1" (required),
      "content":"testQ1" (required)
    }
    ```

  - **Response:**
    - **Success**
  
      ```json
      status code: 200
      
      {
        "status": "success",
        "message": "成功新增問題",
        "question": {
            "id": 25,
            "title": "testQ1",
            "content": "testQ1",
            "createdAt": "2023-02-07T07:28:22.932Z",
            "updatedAt": "2023-02-07T07:28:22.932Z",
            "userId": 5
        }
      }
      ```
      
    - **Error: data required**
       ```json
      status code: 400

      {
        "status": "400FR",
        "message": "Field: title and content are required."
      }
      ```

    - **Error: data length limit**

       ```json
      status code: 400

      {
        "status": "400FL",
        "message": "Field: content length should be under 500 characters."
      }
      ```
### Question getQuestion `GET /api/v1/questions/:id`
  - **Parameters:**

    | KEY | VALUE |
    | --- | ----- |
    | id  | 1     |

  - **Response:**
    - **Success**
  
      ```json
      status code: 200
      
      {
        "status": "success",
        "message": "Get specific question.",
        "question": {
            "id": 1,
            "title": "投出履歷前需要把全部的leetcode easy題刷完嗎？",
            "content": "聽說面試會考leetcode，這樣要把leetcode刷到什麼程度才可以把履歷投出去？或是要刷哪些topic？謝謝解惑。",
            "createdAt": "2023-02-07T07:27:14.950Z",
            "updatedAt": "2023-02-07T07:27:14.950Z",
            "userId": 5,
            "User": {
                "id": 5,
                "role": "TA",
                "name": "admin",
                "avatar": null
            },
            "answerCount": 6
        }
      }
      ```
      
    - **Error: data not found**
       ```json
      status code: 404

      {
        "status": "error",
        "message": "The question is not found."
      }
      ```

