const express = require('express');
const router = express.Router();
const jobController = require('../controller/job.controller');

router.post('/api/jobs', jobController.createJob);
router.get('/api/jobs/:job_id', jobController.getJobById); 
router.put('/api/jobs/:id', jobController.updateJob);
router.delete('/api/jobs/:job_id', jobController.deleteJob);
router.get('/api/jobs/', jobController.getAllJob);

module.exports = router;