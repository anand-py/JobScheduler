const express = require('express');
const router = express.Router();
const jobController = require('../controller/job.controller');

router.post('/api/jobs', jobController.createJob)
router.get('/api/jobs/:id', jobController.getJobById)
router.put('/api/jobs/:id', jobController.updateJob)
router.delete('/api/jobs/:id', jobController.deleteJob)
router.get('/api/jobs', jobController.getAllJobs)


module.exports = router;