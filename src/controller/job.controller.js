

const Job = require('../model/job.models');
const logger = require('../utils/logger')
const { scheduleRecurringJobs } = require('../utils/recrurringJobManager')

let recurringJobsScheduled = false;
if (!recurringJobsScheduled) {
    scheduleRecurringJobs();
    recurringJobsScheduled = true;
}

exports.submitJob = async (req, res) => {
    try {
        logger.info("Received a request to submit a job");
        const { user_id, type, scheduled_time, parameters, isRecurring, cron_expression, max_attempts } = req.body;
        
        if (!user_id) {
            logger.error("User ID is required");
            return res.status(400).send({ error: "User ID is required" });
        }
        
        const job = new Job({
            user_id: user_id,
            type: type,
            scheduled_time: new Date(scheduled_time),
            parameters: parameters,
            isRecurring: isRecurring || false, // Mark job as recurring if specified
            cron_expression: cron_expression || null, // Store cron expression if job is recurring
            max_attempts: max_attempts || 2 // Set maximum attempts for retries
        });

        await job.save();
        res.status(201).send({
            message: "Job Submitted Successfully",
            job: job
        });
    } catch (error) {
        logger.error(`Error submitting job: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

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