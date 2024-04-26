
# Chronos : Job Scheduler System

In modern computing environments, efficient task scheduling, management, and monitoring are crucial. This project aims to design and implement a robust and scalable backend for a job scheduling system.


## Installation

Install job scheduler system with npm

```bash
  cd job scheduler system
  npm install
```
    
## API Reference

#### Submit a new job.

```http
  POST /api/submitJob
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. API key |

#### Get Job by ID

```http
  GET /api/jobs/:job_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `job_id`      | `string` | **Required**. Id of item to fetch |

#### Reschedule Job

```http
  PUT /api/jobs/:job_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `job_id`      | `string` | **Required**. ID of the job to reschedule |

#### Cancel Job

```http
  DELETE /api/jobs/:job_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `job_id`      | `string` | **Required**. ID of the job to cancel |

#### Get All Jobs

```http
  GET /api/jobs
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string` | **Required**. API Key |

#### Get Job Status

```http
  GET /api/jobs/:job_id/status
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `job_id`      | `string` | **Required**. ID of the job to fetch status |


## Job Scheduler with Recurring and One-Time Jobs

This Node.js application manages scheduling and execution of jobs, including both recurring and one-time jobs. It leverages the following libraries:

* `node-schedule`: For scheduling jobs based on cron expressions.
* `nodemailer` (optional): For sending notification emails upon job failures.

**Functionality Overview:**

* **Recurring Jobs:**
    * Schedules jobs based on cron expressions defined in the `Job` model.
    * Uses `node-schedule` to schedule job execution at specified intervals.
* **One-Time Jobs:**
    * Schedules jobs based on a specific `scheduled_time` property in the `Job` model.
    * Executes the job at the designated time.
* **Job Execution:**
    * Manages the execution flow of both recurring and one-time jobs.
    * Implements a retry mechanism for failed recurring jobs (configurable `max_attempts` in the `Job` model).
* **Job Failure Handling:**
    * Logs error messages for failed jobs.
    * Optionally sends notification emails about failures using `sendNotificationEmail` (requires configuration).
## Running Tests

To run tests, run the following command

```bash
  npx jest
```


## Documentation

[Documentation](https://docs.google.com/document/d/17Vj7TWz0jr7mMliQJr4EZgPvPUmuLGVvWAZYwv1NmcI/edit?usp=sharing)


## Deploy Link

[Online Link](https://job-scheduler-delta.vercel.app/)


## Help

For any issues or questions, please contact aanand.py@gmail.com.
