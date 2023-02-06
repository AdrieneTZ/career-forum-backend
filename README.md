# Career Forum Backend
## Introduction
Career Forum is a project for AC TAs, alumni and students to ask the questions and share their answers while finding jobs.

- Qualification for registering:
  - All AC TAs
  - All students that are at the third semester
  - Attended the the third semester and graduated from AC

- Project Link: **[Career Forum](https://careerforum-group.vercel.app/)**

## URL
#### [Production Environment Base Url:](https://0lrxs3wck8.execute-api.ap-northeast-1.amazonaws.com/api/v1)

```
https://0lrxs3wck8.execute-api.ap-northeast-1.amazonaws.com/api/v1

// user
email: user@careerforum.com
password: As123456!

// admin
email: admin@careerforum.com
password: As123456!
```
#### Local Environment Base Url:
```
http://localhost:3000/api/v1
```


## ERD
![ERD](images/career-forum-ERD.jpeg)

## Contents
### [Prerequisite](#prerequisite)
### [Start the Project](#start-the-project)
### API Documents
| Entity | File |
| :------: | :----: |
| User | [user-apis.md](APIs/user-apis.md) |
| Admin | [admin-apis.md](APIs/admin-apis.md) |
| Question | [question-apis.md](APIs/question-apis.md) |
| Answer | [answer-apis.md](APIs/answer-api.md) |


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

- create seed data
  ```
  $ npm run seed
  ```


