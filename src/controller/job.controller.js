

const Job = require('../model/job.models');
const userModels = require('../model/user.models');

exports.createJob = async (req, res) => {
    try {
        const { user_id, type, scheduled_time, parameters } = req.body;
        
        if (!user_id) {
            return res.status(400).send({ error: "User ID is required" });
        }

        const job = new Job({
            user_id: user_id,
            type: type,
            scheduled_time: new Date(scheduled_time), // Convert scheduled_time to a Date object
            parameters: parameters
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
        const job = await Job.findById(req.params._id);
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

exports.updateJob = async(req,res)=>{
    try{
        const jobId = req.params.job_id;
        const updates = req.body;
        const options = { new : true }
        const updatedJob = await Job.findByIdAndUpdate(jobId,updates,options) 
        if(!updatedJob){
            res.status(404).json({
                message : "Job not found"
            })
        }
        res.status(200).json({ 
            message : "Job Update Successfully", 
            job : updatedJob
        })
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteJob = async(req,res)=>{
    try{
        const job = await Job.findById(req.params.job_id);
        if(!job){
            res.status(404).json({ message : "Job not found"})
        }
        await job.deleteOne({ _id : req.params.job_id });
        res.status(200).json({ message : "Job deleted Successfully"})
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllJob = async(req,res)=>{
    try {
        // const jobs = await Job.find({ user_id: req.userId });  
        const jobs = await Job.find(req.params._id); 
        res.status(200).json(jobs);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };