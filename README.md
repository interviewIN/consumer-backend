# Careers Backend

REST API to show the list of jobs with JWT authentication.

## Features

- [x] JWT Authentication and Authorization
- [x] Bcrypt password hashing
- [x] Cookies
- [x] Filter jobs by location/description/type
- [x] Pagination

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
npm install
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
npm start
```

### Authentication

#### Register

```http
POST /auth/register
```

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `username` | `string` | **Required**. User username |
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
