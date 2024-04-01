const express = require('express');
const router = express.Router();
const jobController = require('../controller/job.controller');
const authJwt = require('../middleware/authJwt')

router.post('/api/submitJob', authJwt.verifyToken ,jobController.submitJob);
router.get('/api/jobs/:job_id',authJwt.verifyToken, jobController.getJobById); 
router.put('/api/jobs/:job_id',authJwt.verifyToken, jobController.recheduleJob);
router.delete('/api/jobs/:job_id', authJwt.verifyToken, jobController.cancelJob);
router.get('/api/jobs',authJwt.verifyToken, jobController.getAllJob);
router.get('/api/jobs/:job_id/status', authJwt.verifyToken, jobController.getJobStatus)
module.exports = router;