const jobController = require('../controller/job.controller')

module.exports = (app) => {
    app.post('/api/jobs', jobController.createJob)
    app.get('/api/jobs/:id', jobController.getJobById)
    app.put('/api/jobs/:id', jobController.updateJob)
    app.delete('/api/jobs/:id', jobController.deleteJob)
    app.get('/api/jobs', jobController.getAllJobs)
}