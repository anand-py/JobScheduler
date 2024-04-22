

const Job = require('../model/job.models');
const logger = require('../utils/logger')
const { scheduleRecurringJobs } = require('../utils/recrurringJobManager')
const { scheduleOneTimeJob } = require('../utils/recrurringJobManager')

let recurringJobsScheduled = false;
if (!recurringJobsScheduled) {
    scheduleRecurringJobs();
    recurringJobsScheduled = true;
}

exports.submitJob = async (req, res) => {
    try {
        const { user_id, type, parameters, isRecurring, scheduled_time, cron_expression, max_attempts } = req.body;
        
        if (!user_id) {
            logger.error("User ID is required");
            return res.status(400).json({ error: "User ID is required" });
        }

        // Check if scheduled_time is provided for one-time job
        if (!isRecurring && !scheduled_time) {
            logger.error("Scheduled time is required for one-time job");
            return res.status(400).json({ error: "Scheduled time is required for one-time job" });
        }

        const currentTime = new Date();
        let scheduledTime = currentTime;

        if (!isRecurring) {
            scheduledTime = new Date(scheduled_time);
            if (scheduledTime <= currentTime) {
                logger.error("Scheduled time must be in the future for one-time job");
                return res.status(400).json({ error: "Scheduled time must be in the future for one-time job" });
            }
        }

        const job = new Job({
            user_id: user_id,
            type: type,
            scheduled_time: scheduledTime,
            parameters: parameters,
            isRecurring: isRecurring || false,
            cron_expression: isRecurring ? cron_expression : null,
            max_attempts: isRecurring ? max_attempts : 2
        });

        await job.save();

        if (isRecurring) {
            // Handle recurring job
            await scheduleRecurringJobs();
            logger.info("Recurring job submitted successfully");
        } else {
            // Handle one-time job
            await scheduleOneTimeJob(job);
            logger.info("One-time job submitted successfully");
        }
        res.status(200).json({ message: "Job submitted successfully", job: job });
    } catch (error) {
        logger.error(`Error submitting job: ${error.message}`);
        res.status(500).json({ error: `Error submitting job: ${error.message}` });
    }
};

exports.getJobById = async(req,res)=>{
    try {
        const job = await Job.findById(req.params.job_id);
        logger.info("Fetching job by ID:", req.params.job_id);
        if (!job) { 
          logger.error("Job not found");
          return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
      } catch (error) { 
        logger.error("Error getting job by ID:", error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };


exports.recheduleJob = async (req, res) => {
        const jobId = req.params.job_id;
        const  { scheduled_time } = req.body;    
        try {
            const updatedJob = await Job.findByIdAndUpdate(jobId, { scheduled_time }, { new : true });
            if (!updatedJob) {
                logger.error("Job not found for rescheduling:", jobId);
                return res.status(404).json({ message: 'Job not found' });
            }
    
            logger.info("Job rescheduled successfully:", updatedJob);
            res.status(200).json({ message: 'Job rescheduled successfully', job: updatedJob });
        } catch (error) {
            logger.error("Error rescheduling job:", error);
            res.status(500).json({ message: 'Internal server error' });
        }   
    };
  

exports.cancelJob = async(req,res)=>{
    try{
        const job = await Job.findByIdAndDelete(req.params.job_id);
        if(!job){
            logger.error("Job not found for cancellation:", req.params.job_id);
            res.status(404).json({ message : "Job not found"})
        }
        res.status(200).json({ message : "Job canceled Successfully"})
    }catch (error) {
        logger.error("Error cancelling job:", error);
        res.status(500).json({ error: error.message });
    }
}

exports.getAllJob = async(req,res)=>{
    try { 
        const jobs = await Job.find(); 
        res.status(200).json(jobs);
      } catch (error) {
        logger.error("Error getting all jobs:", error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

exports.getJobStatus = async(req,res)=>{
    try{ 
        const job = await Job.findById(req.params.job_id)
        if(!job){   
            logger.error("Job not found:", req.params.job_id);
            res.status(404).json({ message : "Job not found"})
        }
        res.status(200).json({ status : job.status})
    } catch (error) {
        logger.error("Error getting job status:", error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };