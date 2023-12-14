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
yarn
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
yarn start
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
