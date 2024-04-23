const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const Job = require('../model/job.models');
const logger = require('../utils/logger');
require('dotenv').config();


// Function to schedule recurring jobs
const scheduleRecurringJobs = async () => {
    try {
        const recurringJobs = await Job.find({ isRecurring: true });

        recurringJobs.forEach(async (job) => {
            try {
                logger.info(job);
                const { cron_expression } = job;
                logger.info(`Scheduling job with cron expression: ${cron_expression}`);
                schedule.scheduleJob(cron_expression, async () => {
                    try {
                        job.status = 'pending'; // Set job status to 'pending' before execution
                        await job.save();
                        await executeJob(job);
                    } catch (error) {
                        logger.error(`Error executing recurring job: ${error.message}`);
                        await handleJobFailure(job);
                    }
                });
            } catch (error) {
                logger.error(`Error scheduling recurring job: ${error.message}`);
            }
        });
    } catch (error) {
        logger.error(`Error scheduling jobs: ${error.message}`);
    }
};

    const executeJob = async (job) => {
        // Check if job status is 'running'
        if (job.status === 'pending') {
            logger.info(`Executing job: ${job._id}`);
            // Set job status to 'running' before execution
            job.status = 'running';
            await job.save();

            // Simulate job execution for 5 seconds (replace with actual execution logic)
            await new Promise((resolve) => setTimeout(resolve, 5000));

            logger.info(`Job executed successfully: ${job._id}`);
            // Set job status to 'successful' after execution
            job.status = 'successful';
            await job.save();
        } else {
            logger.info(`Job ${job._id} is not in 'running' state. Skipping execution.`);
            return; // Exit the function since job is not in 'running' state
        }
            // Check if the job failed to execute
            if (job.status === 'running') {
                // Set job status to 'failed' if execution failed
                job.status = 'failed';
                await job.save();
                // Call handleJobFailure to handle the failure
                await handleJobFailure(job);
            } else {
                // Job executed successfully
                logger.info(`Failed Job executed successfully: ${job._id}`);
                // Set job status to 'successful' after execution
                job.status = 'successful';
                await job.save();
            }
        
    };


const handleJobFailure = async (job) => {
    try {
        let attempts = 0;

        while (attempts < job.max_attempts && job.status !== 'successful') {
            attempts++;
            logger.info(`Retrying job: ${job._id}, Attempt: ${attempts}`);
            
            try {
                await executeJob(job);
            } catch (error) {
                logger.error(`Error executing job: ${error.message}`);
            }

            // Introduce a small delay after each attempt
            await new Promise((resolve) => setTimeout(resolve, 5000)); // 1000 milliseconds = 1 second
        }

        if (job.status !== 'successful') {
            job.status = 'failed';
            logger.error(`Job failed after reaching maximum retry attempts: ${job._id}`);
            logger.info(`Notifying user about job failure: ${job._id}`);
            await sendNotificationEmail(job);
            await job.save(); // Save the job with the updated status
        }
    } catch (error) {
        logger.error(`Error handling job failure: ${error.message}`);
        throw error;
    }
};



// Function to schedule a one-time job
const scheduleOneTimeJob = async (job) => {
    try {
        logger.info(`Scheduling one-time job: ${job._id}`);
        const scheduledTime = job.scheduled_time;
        schedule.scheduleJob(scheduledTime, async () => {
            try {
                await executeOneTimeJob(job);
            } catch (error) {
                logger.error(`Error executing one-time job: ${error.message}`);
                await handleOneTimeJobFailure(job);
            }
        });
        logger.info(`One-time job scheduled successfully: ${job._id}`);
    } catch (error) {
        logger.error(`Error scheduling one-time job: ${error.message}`);
    }
};

const executeOneTimeJob = async (job) => {
    try {
        logger.info(`Executing one-time job: ${job._id}`);
        job.status = 'running';
        await job.save();
        // Simulate job execution for 5 seconds (replace with actual execution logic)
        await new Promise((resolve) => setTimeout(resolve, 5000));
        logger.info(`One-time job executed successfully: ${job._id}`);
        job.status = 'successful';
        await job.save();
    } catch (error) {
        logger.error(`Error executing one-time job: ${error.message}`);
        // If execution fails, handle the failure
        job.status = 'running'; // Set job status to 'running' if execution fails
        await job.save();
    }
    
    // Handle one-time job failure
    try {
        await handleOneTimeJobFailure(job);
    } catch (handleError) {
        logger.error(`Error handling one-time job failure: ${handleError.message}`);
    }
};


const handleOneTimeJobFailure = async (job) => {
    try {
        logger.error(`One-time job failed: ${job._id}`);
        // Handle the failure, e.g., send notification
        // Set job status to 'failed'
        job.status = 'failed';
        await sendNotificationEmail(job);
        await job.save();
        // Add logic to send notification email or perform any other action
    } catch (error) {
        logger.error(`Error handling one-time job failure: ${error.message}`);
    }
};


// Function to send notification email for job failure
const sendNotificationEmail = async (job) => {
    return new Promise((resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.USER,
                    pass: process.env.APP_PASSWORD,
                }
            });

            const mailOptions = {
                from: process.env.USER,
                to: 'aanand.py@gmail.com',
                subject: `Job Failure: ${job._id}`,
                text: `The job ${job._id} has failed after reaching maximum retry attempts.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error(`Error sending email notification: ${error.message}`);
                    reject(error);
                } else {
                    logger.info(`Email notification sent: ${info.messageId}`);
                    resolve(info);
                }
            });
        } catch (error) {
            logger.error(`Error sending email notification: ${error.message}`);
            reject(error);
        }
    });
};

module.exports = { scheduleRecurringJobs, executeJob, handleJobFailure, sendNotificationEmail, handleOneTimeJobFailure, executeOneTimeJob, scheduleOneTimeJob };

