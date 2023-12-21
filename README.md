# Consumer Backend

REST API to support InterviewIN

## Features

- [x] JWT Authentication and Authorization
- [x] Bcrypt password hashing
- [x] Cookies

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
- [PostgreSQL](https://www.postgresql.org/) - Open source object-relational database system

### Installation

1. Clone the repository

```bash
git clone https://github.com/interviewIN/consumer-backend
```

2. Install dependencies

```bash
npm i
```

3. Copy the `.env.example` file to `.env` and update the environment variables

```bash
cp .env.example .env
```

4. Push the database schema

```bash
npx prisma db push
```

5. Start the server

```bash
npm run start
```

### Authentication

#### Register

```http
POST /auth/register
```

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `username` | `string` | **Required**. User username |
| `email`    | `string` | **Required**. User email    |
| `password` | `string` | **Required**. User password |
| `role`     | `string` | **Optional**. User password |

#### Login

```http
POST /auth/login
```

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `username` | `string` | **Required**. User username |
| `password` | `string` | **Required**. User password |

### User

#### Get User Details

```http
GET /user/
```

#### Update User Details

```http
PATCH /user/
```

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `name`     | `string` | **Required**. User username |
| `email`    | `string` | **Required**. User email    |

### Interview

#### Get All Interviews

```http
GET /interview/
```

#### Get Interview Details

```http
GET /interview/:id
```

#### Get Interview By Job

```http
GET /interview/job/:id
```

#### Get Interview Chat

```http
GET /interview/:id/chat
```

#### Patch Interview

```http
PATCH /interview/
```

| Body          | Type     | Description                    |
| :---------    | :------- | :------------------------------|
| `interviewId` | `string` | **Required**. Interview id     |
| `status`      | `string` | **Required**. Interview Status |

### Job

#### Get All Jobs

```http
GET /jobs/
```

#### Post Job

```http
POST /jobs/
```

| Body                 | Type       | Description                             |
| :------------------- | :--------- | :-------------------------------------- |
| `title`              | `string`   | **Required**. Job title                 |
| `description`        | `string`   | **Required**. Job description           |
| `interviewQuestions` | `string[]` | **Required**. Job interview questions   |

####  Apply for Job

```http
POST /jobs/apply
```

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `jobId`    | `string` | **Required**. Job id        |
