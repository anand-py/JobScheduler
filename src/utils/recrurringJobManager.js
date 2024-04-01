const cron = require('node-cron')
const Job = require('../model/job.models')

exports.scheduleRecurringJobs = ()=>{
    try{
        Job.find({ isRecurring : true }, (err, recurringJobs)=>{
            if(err){
                console.error('Error fetching recrurring jobs', err)
            }
        })
        recurringJobs.forEach(job=>{
            const { cron_expression } = job
            console.log(`Scheduling job with cron expression: ${cron_expression}`);
            
            cron.schedule(cron_expression, async()=>{
                try {
                    await executeJob(job);
                } catch (error) {
                    console.error(`Error executing recurring job: ${error.message}`);
                }
            })
        })

    }catch (error) {
        console.error('Error fetching recurring jobs:', error);
    }
}