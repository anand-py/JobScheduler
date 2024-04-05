

const Job = require('../model/job.models');
const mongoose = require('mongoose');
const userModels = require('../model/user.models');
const { scheduleRecurringJobs } = require('../utils/recrurringJobManager')

let recurringJobsScheduled = false;
if (!recurringJobsScheduled) {
    scheduleRecurringJobs();
    recurringJobsScheduled = true;
}
exports.submitJob = async (req, res) => {
    try {
        console.log("Received a request to submit a job");
        const { user_id, type, scheduled_time, parameters, isRecurring, cron_expression, max_attempts } = req.body;
        
        if (!user_id) {
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
        res.status(500).json({ error: error.message });
    }
}

exports.getJobById = async(req,res)=>{
    try {
        const job = await Job.findById(req.params.job_id);
        console.log(job)
        if (!job) { 
          return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
      } catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };


exports.recheduleJob = async (req, res) => {
        const jobId = req.params.job_id;
        const  { scheduled_time } = req.body;    
        try {
            const updatedJob = await Job.findByIdAndUpdate(jobId, { scheduled_time }, { new : true });
            if (!updatedJob) {
                return res.status(404).json({ message: 'Job not found' });
            }
    
            console.log(updatedJob);
            res.status(200).json({ message: 'Job rescheduled successfully', job: updatedJob });
        } catch (error) {
            console.error('Error updating job:', error);
            res.status(500).json({ message: 'Internal server error' });
        }   
    };
  

exports.cancelJob = async(req,res)=>{
    try{
        const job = await Job.findByIdAndDelete(req.params.job_id);
        if(!job){
            res.status(404).json({ message : "Job not found"})
        }
        res.status(200).json({ message : "Job canceled Successfully"})
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllJob = async(req,res)=>{
    try { 
        const jobs = await Job.find(); 
        res.status(200).json(jobs);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

exports.getJobStatus = async(req,res)=>{
    try{ 
        const job = await Job.findById(req.params.job_id)
        if(!job){   
            res.status(404).json({ message : "Job not found"})
        }
        res.status(200).json({ status : job.status})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };