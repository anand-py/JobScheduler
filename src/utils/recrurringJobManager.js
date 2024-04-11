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
                logger.info(job);
                const { cron_expression } = job;
                logger.info(`Scheduling job with cron expression: ${cron_expression}`);
                schedule.scheduleJob(cron_expression, async () => {
                    try {
                        await executeJob(job);
                    } catch (error) {
                        logger.error(`Error executing recurring job: ${error.message}`);
                        await handleJobFailure(job);
                    }
                });
            });
        }
    catch (error) {
        logger.error(`Error scheduling jobs: ${error.message}`);
    }

}

// Function to execute a job
const executeJob = async (job) => {
    try {
        logger.info(`Executing job: ${job._id}`);
        job.status = 'running';
        await job.save();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        logger.info(`Job executed successfully: ${job._id}`);
        job.status = 'successful';
        await job.save();
    } catch (error) {
        logger.error(`Error executing job: ${error.message}`);
        throw new Error(`Error executing job: ${error.message}`);
    }
};

// Function to handle job failure and retries
const handleJobFailure = async (job) => {
    try {
        if (job.attempts < job.max_attempts) {
            job.attempts++;
            job.status = 'running';
            await job.save();
            logger.info(`Retrying job: ${job._id}, Attempt: ${job.attempts}`);
            await executeJob(job);
        } else {
            logger.error(`Job failed after reaching maximum retry attempts: ${job._id}`);
            job.status = 'failed';
            await job.save();
            logger.info(`Notifying user about job failure: ${job._id}`);
            await sendNotificationEmail(job);
        }
    } catch (error) {
        logger.error(`Error handling job failure: ${error.message}`);
        console.error(`Error handling job failure: ${error.message}`);
    }
};

// Function to send notification email for job failure
const sendNotificationEmail = async (job) => {
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

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email notification sent: ${info.messageId}`);
    } catch (error) {
        console.error(`Error sending email notification: ${error.message}`);
    }
};

const scheduleOneTimeJob = async () => {
    try {
        const jobs = await Job.find({ isRecurring: false });
        if (jobs.length === 0) {
            logger.info("No one-time jobs found.");
            return;
        }

        for (const job of jobs) {
            const specificTime = new Date('2024-04-11T17:02:00');
            logger.info(`Scheduling one-time job at: ${specificTime}`);
            schedule.scheduleJob(specificTime, async () => {
                try {
                    await executeOneTimeJob(job); // Pass the job object to the execute function
                } catch (error) {
                    logger.error(`Error executing one-time job: ${error.message}`);
                    await handleOneTimeJobFailure(job); // Pass the job object to the failure handler
                }
            });
        }
    } catch (error) {
        logger.error(`Error scheduling one-time jobs: ${error.message}`);
    }
};

const executeOneTimeJob = async (job) => {
    try {
        // Perform the execution logic for the one-time job
        logger.info(`Executing one-time job: ${job._id}`);
        // Example: Sending an email
        await sendEmail("One-time job executed successfully");
    } catch (error) {
        logger.error(`Error executing one-time job: ${error.message}`);
        throw new Error(`Error executing one-time job: ${error.message}`);
    }
};

const handleOneTimeJobFailure = async (job) => {
    try {
        // Handle the failure of the one-time job
        logger.error(`One-time job failed: ${job._id}`);
        // Example: Sending an email notification
        await sendEmail("One-time job failed");
    } catch (error) {
        logger.error(`Error handling one-time job failure: ${error.message}`);
    }
};

module.exports = { scheduleRecurringJobs, executeJob, handleJobFailure, sendNotificationEmail, handleOneTimeJobFailure, executeOneTimeJob, scheduleOneTimeJob };