## Question APIs
| Feature                                                                                              | HTTP Method | URL                           |
| ---------------------------------------------------------------------------------------------------- | :---------: | ----------------------------- |
| [create a question](#question-postquestion-post-apiv1questions)                                      |    POST     | /api/v1/questions             |
| [get the specific question](#question-getquestion-get-apiv1questionsid)                              |     GET     | /api/v1/questions/:id         |
| [get all questions](#question-getquestions-get-apiv1questions)                                       |     GET     | /api/v1/questions             |
| [get all answers of the specific question](#question-getquestionanswers-get-apiv1questionsidanswers) |     GET     | /api/v1/questions/:id/answers |
| [edit the specific question](#question-putquestion-put-apiv1questionsid)                             |     PUT     | /api/v1/questions/:id         |
| [delete the specific question](#question-deletequestion-delete-apiv1questionsid)                     |   DELETE    | /api/v1/questions/:id         |


### Question postQuestion `POST /api/v1/questions`
  - **Requset body:**
    ```json
    {
      "title": "testQ1" (required),
      "content": "testQ1" (required)
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

### Question getQuestions `GET /api/v1/questions`
  - **Parameters:**

    | KEY   | VALUE |
    | ----- | ----- |
    | page  |       |
    | limit |       |

  - **Response:**
    - **Success**
  
      ```json
      status code: 200
      
      {
        "status": "success",
        "message": "Get questions",
        "count": 1,  // 資料總筆數
        "page": 1, // 預設回傳第一頁
        "limit": 10, // 預設回傳 10 筆資料
        "questions": [
            {
                "id": 1,  // questions PK:id
                "title": "如何找到好工作?",
                "content": "內文",
                "createdAt": "2023-01-11T15:54:30.000Z",
                "updatedAt": "2023-01-11T15:54:30.000Z",
                "userId": 1, // FK: userId
                "User": { //問題擁有者
                    "id": 1,
                    "role": "student",
                    "name": "Lois",
                    "avatar": null
                },
                "Answers": [
                    { // 預設回傳最新，limit:1
                        "id": 1, // answer PK:id
                        "content": "找好工作的秘訣就是投履歷",
                        "createdAt": "2023-01-11T15:54:33.000Z",
                        "updatedAt": "2023-01-11T15:54:33.000Z",
                        "questionId": 1,  // FK: questionId
                        "userId": 1,  // FK: userId
                        "User": {  //回答擁有者
                            "id": 1, // user PK:id
                            "role": "student",
                            "name": "Lois",
                            "avatar": null
                        }
                    }
                ],
                "_count": {
                    "Answers": 1 //為了算answersCount而有的欄位
                },
                "answersCount": 4
            },
          //...
        ]
      }
      ```
      
    - **Error: data not found**
       ```json
      status code: 404

      {
        "status": "error",
        "message": "Questions are not found."
      }
      ```

### Question getQuestionAnswers `GET /api/v1/questions/:id/answers`
  - **Parameters:**

    | KEY   | VALUE |
    | ----- | ----- |
    | page  |       |
    | limit |       |
    | id    | 1     |

  - **Response:**
    - **Success**
  
      ```json
      status code: 200
      
      {
        "status": "success",
        "message": "Get specific question's answers.",    
        "count": 2, // 資料回傳總筆數
        "page": 1, // 預設回傳第一頁
        "limit": 10, // 預設回傳 10 筆資料
        "answers": [
            {
                "id": 1, // question PK:id
                "content": "找好工作的秘訣就是投履歷",
                "createdAt": "2023-01-11T21:26:57.000Z",
                "updatedAt": "2023-01-11T21:26:57.000Z",
                "questionId": 1, // FK: questionId
                "userId": 1, // FK:userId
                "User": { // 回答擁有者
                    "id": 1, // user PK:id
                    "role": "graduate",
                    "name": "user",
                    "avatar": null
                }
            },
            {
                "id": 2,
                "content": "好工作需要緣分",
                "createdAt": "2023-01-11T21:27:06.000Z",
                "updatedAt": "2023-01-11T21:27:06.000Z",
                "questionId": 1,
                "userId": 1,
                "User": {
                    "id": 1,
                    "role": "graduate",
                    "name": "user",
                    "avatar": null
                }
            }
          //...
        ]
      }
      ```
      
    - **Error: data not found**
       ```json
      status code: 404

      {
        "status": "error",
        "message": "The question's answers are not found."
      }
      ```

### Question putQuestion `PUT /api/v1/questions/:id`
  - **Parameters:**

    | KEY | VALUE |
    | --- | ----- |
    | id  | 1     |

  - **Requset body:**
    ```json
    {
      "title":"testPutQ1" (required),
      "content":"testPutQ1" (required)
    }
    ```

  - **Response:**
    - **Success**
  
      ```json
      status code: 200
      
      {
        "status": "success",
        "message": "Successfully modify question",
        "question": {
            "id": 1,
            "title": "testPutQ1",
            "content": "testPutQ1",
            "createdAt": "2023-02-07T07:27:14.950Z",
            "updatedAt": "2023-02-07T08:54:12.288Z",
            "userId": 5
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

    - **Error:**
       ```json
      status code: 403

      {
        "status": "error",
        "message": "Permission denied."
      }
      ```

    - **Error:**
       ```json
      status code: 400

      {
        "status": "400FR",
        "message": "Field: title and content are required."
      }
      ```

    - **Error:**
       ```json
      status code: 400

      {
        "status": "400FL",
        "message": "Field: title length should be under 50 characters."
      }
      ```

    - **Error:**
       ```json
      status code: 400

      {
        "status": "400FL",
        "message": "Field: content length should be under 500 characters."
      }
      ```

### Question deleteQuestion `DELETE /api/v1/questions/:id`
  - **Parameters:**

    | KEY | VALUE |
    | --- | ----- |
    | id  | 25    |

  - **Response:**
    - **Success**
  
      ```json
      status code: 200
      
      {
        "status": "success",
        "message": "Successfully delete question",
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
      
    - **Error: data not found**
       ```json
      status code: 404

      {
        "status": "error",
        "message": "The question is not found."
      }
      ```

    - **Error:**
       ```json
      status code: 403

      {
        "status": "error",
        "message": "Permission denied."
      }
      ```
