// src/utils/recurringJobUtils.js

const schedule = require('node-schedule');
const Job = require('../model/job.models');

const scheduleRecurringJobs = async () => {
    try {
        // Logic to fetch recurring jobs from the database
        const recurringJobs = await Job.find({ isRecurring: true });

        recurringJobs.forEach(async (job) => {
            console.log(job);
            const { cron_expression } = job;
            console.log(`Scheduling job with cron expression: ${cron_expression}`);

            // Schedule the job based on cron expression
            schedule.scheduleJob(cron_expression, async () => {
                try {
                    await executeJob(job);
                } catch (error) {
                    console.error(`Error executing recurring job: ${error.message}`);
                    await handleJobFailure(job);
                }
            });
        });
    } catch (error) {
        console.error(`Error scheduling recurring jobs: ${error.message}`);
    }
};

// Function to execute a job
const executeJob = async (job) => {
    try {
        // Implement job execution logic here
        console.log(`Executing job: ${job._id}`);
        // Update job status to 'running'
        job.status = 'running';
        await job.save();
        // throw new Error('Intentional error occurred during job execution');
        // Example: Simulating job execution for 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(`Job executed successfully: ${job._id}`);
        // Update job status to 'successful' after execution
        job.status = 'successful';
        await job.save();
    } catch (error) {
        throw new Error(`Error executing job: ${error.message}`);
    }
};

// Function to handle job failure and retries
const handleJobFailure = async (job) => {
    try {
        if (job.attempts < job.max_attempts) {
            job.attempts++;
            job.status = 'running'; // Reset job status to 'running' before retrying
            await job.save();
            console.log(`Retrying job: ${job._id}, Attempt: ${job.attempts}`);
            await executeJob(job); // Retry the job
        } else {
            console.log(`Job failed after reaching maximum retry attempts: ${job._id}`);
            job.status = 'failed';
            await job.save();
            console.log(`Notifying user about job failure: ${job._id}`);
            // Implement user notification logic here
        }
    } catch (error) {
        console.error(`Error handling job failure: ${error}`);
        // Implement error handling logic, such as logging the error or notifying administrators
    }
};


module.exports = { scheduleRecurringJobs, executeJob, handleJobFailure };